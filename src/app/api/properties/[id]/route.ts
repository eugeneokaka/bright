import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (property.ownerId !== dbUser.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.property.delete({
      where: { id },
    });

    return new NextResponse("Deleted", { status: 200 });
  } catch (error) {
    console.error("[PROPERTY_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, description, price, location, images, city, phone, email, type } = body;

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const property = await prisma.property.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!property) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (property.ownerId !== dbUser.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Determine which images to delete and which to add
    // In a full implementation, you'd compare the incoming images with existing ones
    // and delete the removed ones from the DB. UploadThing handles actual file deletion 
    // separately usually, but for DB we can just clear and recreate or selectively delete.
    // Simplifying: Delete images not in the new list, create new ones.
    
    const incomingUrls = images.map((img: { url: string }) => img.url);
    const existingUrls = property.images.map(img => img.url);

    const imagesToDelete = property.images.filter(img => !incomingUrls.includes(img.url));
    const imagesToAdd = images.filter((img: {url: string}) => !existingUrls.includes(img.url));

    await prisma.$transaction(async (tx) => {
      // 1. Update primitive fields
      await tx.property.update({
        where: { id },
        data: {
          title,
          description,
          price,
          location,
          city,
          phone,
          email,
          type,
        },
      });

      // 2. Delete removed images
      if (imagesToDelete.length > 0) {
        await tx.image.deleteMany({
          where: {
            id: { in: imagesToDelete.map(img => img.id) }
          }
        });
      }

      // 3. Create new images
      if (imagesToAdd.length > 0) {
        await tx.image.createMany({
          data: imagesToAdd.map((img: {url: string}) => ({
            url: img.url,
            propertyId: id,
          }))
        });
      }
    });

    const updatedProperty = await prisma.property.findUnique({
      where: { id },
      include: { images: true }
    });

    return NextResponse.json(updatedProperty);
  } catch (error) {
    console.error("[PROPERTY_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
