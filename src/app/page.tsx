import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import SiteNav from "@/components/SiteNav";
import { prisma } from "@/lib/prisma";
import SearchFilters from "@/components/SearchFilters";

export const revalidate = 0; // Ensures fresh data is fetched on load

export default async function Home(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const city = typeof searchParams.city === 'string' ? searchParams.city : undefined;
  const location = typeof searchParams.location === 'string' ? searchParams.location : undefined;
  const maxPrice = typeof searchParams.maxPrice === 'string' ? parseFloat(searchParams.maxPrice) : undefined;
  const type = typeof searchParams.type === 'string' ? searchParams.type : undefined;

  // Fetch properties including their images
  const properties = await prisma.property.findMany({
    where: {
      ...(city ? { city: { contains: city, mode: "insensitive" } } : {}),
      ...(location ? { location: { contains: location, mode: "insensitive" } } : {}),
      ...(maxPrice && !isNaN(maxPrice) ? { price: { lte: maxPrice } } : {}),
      ...(type ? { type: { contains: type, mode: "insensitive" } } : {}),
    },
    include: {
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-brand-yellow selection:text-black pb-20">
      {/* Navigation */}
      <SiteNav />

      <main className="max-w-7xl mx-auto px-6 pt-16">
        <div className="flex flex-col items-center text-center justify-center mb-16 mt-8 gap-4 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-2">
            Discover <span className="text-zinc-400">Extraordinary</span> Properties
          </h1>
          <p className="text-zinc-500 text-lg md:text-xl leading-relaxed">
            Explore our curated selection of the finest real estate available right now.
          </p>
        </div>

        <SearchFilters />

        {properties.length === 0 ? (
          <div className="text-center py-32 border border-zinc-100 rounded-2xl bg-zinc-50/50">
            <h3 className="text-xl font-medium text-zinc-800 mb-2">No properties found</h3>
            <p className="text-zinc-500 mb-6">There are currently no listings matching your criteria.</p>
            <SignedIn>
              <Link href="/create-property" className="inline-block bg-brand-yellow text-black font-medium px-6 py-3 rounded-full hover:bg-brand-yellow-hover transition-colors">
                List a property
              </Link>
            </SignedIn>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <Link 
                href={`/properties/${property.id}`} 
                key={property.id} 
                className="group cursor-pointer flex flex-col"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 mb-4 border border-zinc-200">
                  {property.images.length > 0 ? (
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
                  {/* Subtle price tag overlay on image */}
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
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

