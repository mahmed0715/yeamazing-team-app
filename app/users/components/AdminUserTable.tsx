"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { z } from "zod";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  role: "ADMIN" | "MANAGER" | "MEMBER";
};
const roleSchema = z.object({
  role: z.enum(["ADMIN", "MANAGER", "MEMBER"]),
});
export default function AdminUserTable({
  users: initialUsers,
}: {
  users: User[];
}) {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const handleRoleChange = async (userId: string, newRole: User["role"]) => {
    const result = roleSchema.safeParse({ role: newRole });
  
    if (!result.success) {
      toast.error("Invalid role selected");
      return;
    }
  
    try {
      await axios.patch(`/api/user/${userId}/role`, result.data);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      toast.success("Role updated successfully");
    } catch (err) {
      toast.error("Failed to update role");
    }
  };
  

  return (
    <table className="min-w-full bg-white border rounded shadow">
      <thead>
        <tr className="text-sm text-left bg-gray-100">
          <th className="p-2">Name</th>
          <th className="p-2">Email</th>
          <th className="p-2">Role</th>
          <th className="p-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="text-sm border-t">
            <td className="p-2">{user.name || "N/A"}</td>
            <td className="p-2">{user.email}</td>
            <td className="p-2">
              <select
                value={user.role}
                onChange={(e) =>
                  handleRoleChange(user.id, e.target.value as User["role"])
                }
                className="p-1 border rounded"
              >
                <option value="MEMBER">MEMBER</option>
                <option value="MANAGER">MANAGER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </td>
            <td className="p-2">
              <button
                onClick={() => handleRoleChange(user.id, user.role)}
                className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Update Role
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
