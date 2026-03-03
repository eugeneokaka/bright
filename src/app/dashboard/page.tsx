import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import SiteNav from "@/components/SiteNav";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import PropertyActions from "@/components/PropertyActions";

export const revalidate = 0; // Ensures fresh data is fetched on load

export default async function DashboardPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
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

  const searchParams = await props.searchParams;
  const tab = typeof searchParams.tab === "string" ? searchParams.tab : "listings";

  let properties: any[] = [];

  if (tab === "liked") {
    const likes = await prisma.like.findMany({
      where: { userId: dbUser.id },
      include: {
        property: {
          include: {
            images: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      }
    });
    properties = likes.map(like => like.property);
  } else {
    properties = await prisma.property.findMany({
      where: { ownerId: dbUser.id },
      include: {
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      }
    });
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-brand-yellow selection:text-black pb-20">
      {/* Navigation */}
      <SiteNav />

      <main className="max-w-7xl mx-auto px-6 pt-16">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Welcome back, {dbUser.firstName}
          </h1>
          <p className="text-zinc-500 text-lg">
            Manage your properties and view your saved listings.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-zinc-200 mb-10">
          <Link 
            href="?tab=listings" 
            className={`pb-4 text-lg font-medium transition-colors relative ${tab === "listings" ? "text-black" : "text-zinc-400 hover:text-zinc-600"}`}
          >
            My Listings
            {tab === "listings" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black rounded-t-full"></span>
            )}
          </Link>
          <Link 
            href="?tab=liked" 
            className={`pb-4 text-lg font-medium transition-colors relative ${tab === "liked" ? "text-black" : "text-zinc-400 hover:text-zinc-600"}`}
          >
            Liked Properties
            {tab === "liked" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black rounded-t-full"></span>
            )}
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-20 border border-zinc-100 rounded-2xl bg-zinc-50/50">
            <h3 className="text-xl font-medium text-zinc-800 mb-2">
              {tab === "liked" ? "No liked properties yet" : "No properties listed yet"}
            </h3>
            <p className="text-zinc-500 mb-6">
              {tab === "liked" 
                ? "Properties you like will appear here."
                : "When you list a property, it will appear here."}
            </p>
            {tab === "listings" && (
              <Link href="/create-property" className="inline-block bg-brand-yellow text-black font-medium px-6 py-3 rounded-full hover:bg-brand-yellow-hover transition-colors">
                List a property
              </Link>
            )}
            {tab === "liked" && (
              <Link href="/" className="inline-block bg-brand-yellow text-black font-medium px-6 py-3 rounded-full hover:bg-brand-yellow-hover transition-colors">
                Explore properties
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div key={property.id} className="relative group">
                <Link 
                  href={`/properties/${property.id}`} 
                  className="cursor-pointer flex flex-col h-full"
                >
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 mb-4 border border-zinc-200">
                    {property.images && property.images.length > 0 ? (
                      <img 
                        src={property.images[0].url} 
                        alt={property.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-in-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400">
                        No Image
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm font-semibold border border-zinc-100">
                      ${property.price.toLocaleString()}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold tracking-tight mb-1 group-hover:text-brand-yellow-hover transition-colors">
                    {property.title}
                  </h3>
                  <p className="text-zinc-500 truncate mb-1">{property.city}</p>
                  <div className="flex items-center text-sm font-medium text-zinc-400 mt-auto pt-2">
                    <svg className="w-4 h-4 mr-1 pb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {property.location}
                  </div>
                </Link>
                {tab === "listings" && (
                  <PropertyActions propertyId={property.id} />
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
