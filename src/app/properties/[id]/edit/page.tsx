import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import EditPropertyForm from "@/components/EditPropertyForm";
import SiteNav from "@/components/SiteNav";

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!dbUser) {
    redirect("/sign-in");
  }

  const resolvedParams = await params;
  const { id } = resolvedParams;

  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      images: true,
    },
  });

  if (!property) {
    redirect("/dashboard"); // Or a 404 page
  }

  if (property.ownerId !== dbUser.id) {
    redirect("/dashboard"); // Unauthorized to edit
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-brand-yellow selection:text-black pb-20">
      <SiteNav />

      <main className="max-w-2xl mx-auto px-6 pt-16">
        <div className="mb-10">
          <h1 className="text-4xl font-semibold tracking-tight mb-2">Edit Listing</h1>
          <p className="text-zinc-500">Update the details or images for your property.</p>
        </div>

        <EditPropertyForm property={property} />
      </main>
    </div>
  );
}
