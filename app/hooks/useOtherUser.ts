import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType } from "../types";
import { User } from "@prisma/client";

const useOtherUser = (
  conversation:
    | FullConversationType
    | { users?: User[]; participants?: { user: User }[] }
) => {
  const session = useSession();

  const otherUser = useMemo(() => {
    const currentUserEmail = session.data?.user?.email;

    const users =
      "participants" in conversation
        ? conversation.participants?.map((p) => p.user)
        : conversation.users || [];

    return users?.find((user) => user.email !== currentUserEmail);
  }, [session.data?.user?.email, conversation]);

  return otherUser;
};

export default useOtherUser;
