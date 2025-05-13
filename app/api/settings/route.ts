import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { updateProfileSchema } from "@/app/libs/validations/schemas";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return new NextResponse(parsed.error.message, { status: 400 });
    }

    const { name, image } = parsed.data;

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: { name, image },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
