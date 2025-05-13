import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { updateUserRoleSchema } from "@/app/libs/validations/schemas";

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const body = await request.json();

  const parsed = updateUserRoleSchema.safeParse(body);
  if (!parsed.success) {
    return new NextResponse(parsed.error.message, { status: 400 });
  }

  const { role } = parsed.data;

  const updatedUser = await prisma.user.update({
    where: { id: params.userId },
    data: { role },
  });

  return NextResponse.json(updatedUser);
}
