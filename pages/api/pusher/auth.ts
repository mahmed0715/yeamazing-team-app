import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { pusherServer } from "@/app/libs/pusher";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const pusherAuthSchema = z.object({
  socket_id: z.string().min(1, "socket_id is required"),
  channel_name: z.string().min(1, "channel_name is required"),
});

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const session = await getServerSession(request, response, authOptions);
  if (!session?.user?.email) {
    return response.status(401).json({ error: "Unauthorized" });
  }

  const parseResult = pusherAuthSchema.safeParse(request.body);
  if (!parseResult.success) {
    return response
      .status(400)
      .json({ error: "Invalid request", details: parseResult.error.flatten() });
  }

  const { socket_id, channel_name } = parseResult.data;

  const data = {
    user_id: session.user.email,
  };

  const authResponse = pusherServer.authorizeChannel(
    socket_id,
    channel_name,
    data
  );
  return response.status(200).send(authResponse);
}
