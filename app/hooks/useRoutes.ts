import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { HiChat } from "react-icons/hi";
import { HiArrowLeftOnRectangle, HiUsers } from "react-icons/hi2";
import { FaUserShield } from "react-icons/fa"; // Icon for admin panel
import { signOut } from "next-auth/react";
import useConversation from "./useConversation";
import { IconType } from "react-icons";

type User = {
  role?: "ADMIN" | "MANAGER" | "MEMBER";
};
interface Route {
  label: string;
  href: string;
  icon: IconType;
  active?: boolean;
  onClick?: () => void; // Add the onClick property here
}
const useRoutes = (currentUser?: User | null) => {
  const pathname = usePathname();
  const { conversationId } = useConversation();
  console.log("current user in use routtes", currentUser);
  const routes = useMemo(() => {
    const baseRoutes: Route[] = [
      {
        label: "Chat",
        href: "/conversations",
        icon: HiChat,
        active: pathname === "/conversations" || !!conversationId,
      },
      {
        label: "Users",
        href: "/users",
        icon: HiUsers,
        active: pathname === "/users",
      },
    ];

    if (currentUser?.role === "ADMIN") {
      baseRoutes.push({
        label: "Admin Panel",
        href: "/admin/users",
        icon: FaUserShield,
        active: pathname === "/admin/users",
      });
    }

    baseRoutes.push({
      label: "Logout",
      onClick: () => signOut(),
      href: "#",
      icon: HiArrowLeftOnRectangle,
    });
    console.log("base routes", baseRoutes);
    return baseRoutes;
  }, [pathname, conversationId, currentUser]);

  return routes;
};

export default useRoutes;
