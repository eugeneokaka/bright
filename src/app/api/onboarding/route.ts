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

    const email = user.emailAddresses[0]?.emailAddress;
    
    if (!email) {
      return new NextResponse("No email found for user", { status: 400 });
    }

    // Check if email already exists for a DIFFERENT user
    const existingByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingByEmail && existingByEmail.clerkId !== userId) {
      return new NextResponse("User with this email already exists", { status: 400 });
    }

    const dbUser = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        firstName,
        lastName,
        role,
        email,
        onboarded: true,
      },
      create: {
        clerkId: userId,
        firstName,
        lastName,
        role,
        email,
        onboarded: true,
      },
    });

    return NextResponse.json(dbUser);
  } catch (error) {
    console.error("[ONBOARDING_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
