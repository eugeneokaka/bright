import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { title, description, price, location, images, city, phone, email, type } = await req.json();

    if (!title || !description || !price || !location || !city || !images || images.length === 0) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    // Get internal user ID based on Clerk ID
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return new NextResponse("User not found in DB", { status: 404 });
    }

    const property = await prisma.property.create({
      data: {
        title,
        description,
        price,
        location,
        city,
        phone,
        email,
        type,
        ownerId: dbUser.id,
        images: {
          create: images.map((img: { url: string }) => ({
            url: img.url,
          })),
        },
      },
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error("[PROPERTIES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
