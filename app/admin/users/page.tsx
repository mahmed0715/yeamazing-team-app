import getUsers from "@/app/actions/getUsers";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AdminUserTable from "@/app/users/components/AdminUserTable";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

export default async function AdminUsersPage() {
    const session = await getServerSession(authOptions);
console.log({session})
    if (!session || (session?.user as any)?.role !== "ADMIN") {
      toast.error("Unauthorized");
        redirect("/"); 
    }
  const users = await getUsers();

  const mappedUsers = users.map((user) => {
    return {
      ...user,
      role: ["ADMIN", "MANAGER", "MEMBER"].includes(user.role) ? user.role : "ADMIN",
    };
  });
  console.log(users)
  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold">User Management: Admin</h1>
      <AdminUserTable users={mappedUsers} />
    </div>
  );
}