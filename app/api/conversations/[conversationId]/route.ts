import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { conversationParamsSchema } from "@/app/libs/validations/schemas";

interface IParams {
  conversationId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    // ✅ Validate params
    const parsed = conversationParamsSchema.safeParse(params);
    if (!parsed.success) {
      return new NextResponse(parsed.error.message, { status: 400 });
    }

    const { conversationId } = parsed.data;

    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!existingConversation) {
      return new NextResponse("Conversation not found", { status: 404 });
    }

    const isParticipant = existingConversation.participants.some(
      (participant) => participant.userId === currentUser.id
    );

    const isAdmin = currentUser.role === "ADMIN";

    if (!isParticipant && !isAdmin) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.conversation.delete({
      where: {
        id: conversationId,
      },
    });

    for (const participant of existingConversation.participants) {
      if (participant.user.email) {
        await pusherServer.trigger(
          participant.user.email,
          "conversation:remove",
          existingConversation
        );
      }
    }

    return new NextResponse("Conversation deleted", { status: 200 });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
