import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { firstName, lastName, role } = await req.json();

    if (!firstName || !lastName || !role) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const dbUser = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        firstName,
        lastName,
        role,
      },
      create: {
        clerkId: userId,
        firstName,
        lastName,
        role,
      },
    });

    return NextResponse.json(dbUser);
  } catch (error) {
    console.error("[ONBOARDING_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
