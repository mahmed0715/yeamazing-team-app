import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { pusherServer } from "@/app/libs/pusher";
import prisma from "@/app/libs/prismadb";
import { z } from "zod";
import {
  messageInputSchema,
  pusherChannelSchema,
  pusherEventSchema,
} from "@/app/libs/validations/schemas";

export async function POST(request: Request) {
  try {
    // Validate current user
    const currentUser = await getCurrentUser();
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Validate request body
    const body = await request.json();
    const validationResult = messageInputSchema.safeParse(body);

    if (!validationResult.success) {
      return new NextResponse(
        JSON.stringify({ errors: validationResult.error.flatten() }),
        { status: 400 }
      );
    }

    const { message, image, conversationId } = validationResult.data;

    // Validate Pusher channel and event names
    const channelValidation = pusherChannelSchema.safeParse(conversationId);
    const eventValidation = pusherEventSchema.safeParse("messages:new");

    if (!channelValidation.success || !eventValidation.success) {
      return new NextResponse("Invalid Pusher configuration", { status: 500 });
    }

    // Create the message
    const newMessage = await prisma.message.create({
      data: {
        body: message,
        image: image,
        conversation: {
          connect: { id: conversationId },
        },
        sender: {
          connect: { id: currentUser.id },
        },
      },
    });

    // Create SeenMessage entry
    await prisma.seenMessage.create({
      data: {
        message: {
          connect: { id: newMessage.id },
        },
        user: {
          connect: { id: currentUser.id },
        },
      },
    });

    // Fetch full message with relations
    const fullMessage = await prisma.message.findUnique({
      where: { id: newMessage.id },
      include: {
        sender: true,
        seenBy: { include: { user: true } },
      },
    });

    if (!fullMessage) {
      return new NextResponse("Message not found", { status: 404 });
    }

    // Update conversation
    const updatedConversation = await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date(),
        messages: { connect: { id: newMessage.id } },
      },
      include: {
        participants: { include: { user: true } },
        messages: {
          include: {
            sender: true,
            seenBy: { include: { user: true } },
          },
        },
      },
    });

    // Trigger Pusher events with validation
    try {
      await pusherServer.trigger(
        channelValidation.data,
        eventValidation.data,
        fullMessage
      );

      const lastMessage = updatedConversation.messages.at(-1);
      if (!lastMessage) {
        throw new Error("No messages in conversation");
      }

      await Promise.all(
        updatedConversation.participants.map(async (participant) => {
          if (!participant.user.email) return;

          const emailValidation = z
            .string()
            .email()
            .safeParse(participant.user.email);
          if (!emailValidation.success) return;

          await pusherServer.trigger(
            emailValidation.data,
            "conversation:update",
            {
              id: conversationId,
              messages: [lastMessage],
            }
          );
        })
      );
    } catch (pusherError) {
      console.error("Pusher error:", pusherError);
      // Continue even if Pusher fails
    }

    return NextResponse.json(fullMessage);
  } catch (error) {
    console.error("ERROR_MESSAGES", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
