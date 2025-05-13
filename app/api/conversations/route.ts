import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { conversationSchema } from "@/app/libs/validations/schemas";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    const parsed = conversationSchema.safeParse(body);
    if (!parsed.success) {
      return new NextResponse(parsed.error.message, { status: 400 });
    }

    const data = parsed.data;

    // ✅ GROUP CHAT
    if (data.isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name: data.name,
          isGroup: true,
        },
      });

      const participantIds = [
        ...data.members.map((m: { value: any }) => m.value),
        currentUser.id,
      ];

      await Promise.all(
        participantIds.map((userId) =>
          prisma.conversationParticipant.create({
            data: { userId, conversationId: newConversation.id },
          })
        )
      );

      const fullConversation = await prisma.conversation.findUnique({
        where: { id: newConversation.id },
        include: {
          participants: {
            include: { user: true },
          },
        },
      });

      fullConversation?.participants.forEach((p) => {
        if (p.user.email) {
          pusherServer.trigger(
            p.user.email,
            "conversation:new",
            fullConversation
          );
        }
      });

      return NextResponse.json(fullConversation);
    }

    // ✅ ONE-ON-ONE CHAT
    const existingConversations = await prisma.conversation.findMany({
      where: {
        isGroup: false,
        participants: {
          every: {
            userId: { in: [currentUser.id, data.userId] },
          },
        },
      },
      include: {
        participants: true,
      },
    });

    const matchingConversation = existingConversations.find((conversation) => {
      const participantIds = conversation.participants.map((p) => p.userId);
      return (
        participantIds.length === 2 &&
        participantIds.includes(currentUser.id) &&
        participantIds.includes(data.userId)
      );
    });

    if (matchingConversation) {
      return NextResponse.json(matchingConversation);
    }

    const newConversation = await prisma.conversation.create({
      data: { isGroup: false },
    });

    await Promise.all(
      [currentUser.id, data.userId].map((id) =>
        prisma.conversationParticipant.create({
          data: { userId: id, conversationId: newConversation.id },
        })
      )
    );

    const fullConversation = await prisma.conversation.findUnique({
      where: { id: newConversation.id },
      include: {
        participants: {
          include: { user: true },
        },
      },
    });

    fullConversation?.participants.forEach((p) => {
      if (p.user.email) {
        pusherServer.trigger(
          p.user.email,
          "conversation:new",
          fullConversation
        );
      }
    });

    return NextResponse.json(fullConversation);
  } catch (error) {
    console.error("POST /api/conversations error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
