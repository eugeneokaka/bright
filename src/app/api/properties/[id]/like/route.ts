import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id: propertyId } = await params;

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_propertyId: {
          userId: user.id,
          propertyId,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      await prisma.property.update({
        where: { id: propertyId },
        data: { likesCount: { decrement: 1 } },
      });
      return NextResponse.json({ liked: false });
    } else {
      // Like
      await prisma.like.create({
        data: {
          userId: user.id,
          propertyId,
        },
      });
      await prisma.property.update({
        where: { id: propertyId },
        data: { likesCount: { increment: 1 } },
      });
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error("[LIKE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
