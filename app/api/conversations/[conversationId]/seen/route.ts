import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import { pusherServer } from "@/app/libs/pusher";
import prisma from "@/app/libs/prismadb";
import { conversationParamsSchema } from "@/app/libs/validations/schemas";

interface IParams {
  conversationId?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // ✅ Validate route params
    const parseResult = conversationParamsSchema.safeParse(params);
    if (!parseResult.success) {
      return new NextResponse(parseResult.error.message, { status: 400 });
    }

    const { conversationId } = parseResult.data;

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          include: {
            seenBy: {
              include: {
                user: true,
              },
            },
          },
        },
        participants: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!conversation) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const lastMessage = conversation.messages[conversation.messages.length - 1];

    if (!lastMessage) {
      return NextResponse.json(conversation);
    }

    const hasSeen = lastMessage.seenBy.some(
      (seen) => seen.userId === currentUser.id
    );

    if (hasSeen) {
      return NextResponse.json(conversation); // Already seen, no update needed
    }

    // Add current user to seenBy
    const updatedMessage = await prisma.seenMessage.create({
      data: {
        message: { connect: { id: lastMessage.id } },
        user: { connect: { id: currentUser.id } },
      },
    });

    const refreshedMessage = await prisma.message.findUnique({
      where: {
        id: lastMessage.id,
      },
      include: {
        sender: true,
        seenBy: {
          include: {
            user: true,
          },
        },
      },
    });

    // Notify current user with updated message
    await pusherServer.trigger(currentUser.email, "conversation:update", {
      id: conversationId,
      messages: [refreshedMessage],
    });

    // Notify all participants via conversation channel
    await pusherServer.trigger(
      conversationId,
      "message:update",
      refreshedMessage
    );

    return new NextResponse("Success");
  } catch (error) {
    console.error("ERROR_MESSAGES_SEEN", error);
    return new NextResponse("Error", { status: 500 });
  }
}
