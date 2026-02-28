import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

// Make the route dynamic
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PropertyPage({ params }: PageProps) {
  const resolvedParams = await params;
  
  const property = await prisma.property.findUnique({
    where: {
      id: resolvedParams.id,
    },
    include: {
      images: true,
      owner: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  if (!property) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-brand-yellow selection:text-black pb-20">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 bg-white sticky top-0 z-50 border-b border-zinc-100 mb-12">
        <Link href="/" className="text-2xl font-semibold tracking-tight hover:text-brand-yellow transition-colors">
          Bright
        </Link>
        <div className="flex items-center gap-6 font-medium">
          <SignedOut>
            <Link href="/sign-in" className="text-zinc-600 hover:text-black transition-colors">
              Sign In
            </Link>
            <Link href="/sign-up" className="bg-brand-yellow text-black px-5 py-2 rounded-full hover:bg-brand-yellow-hover transition-colors font-medium">
              Get Started
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/create-property" className="text-zinc-600 hover:text-black transition-colors mr-2">
              Create Listing
            </Link>
            <UserButton appearance={{
              elements: { userButtonAvatarBox: "h-9 w-9" }
            }} />
          </SignedIn>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6">
        {/* Header Section */}
        <div className="mb-10 flex flex-col items-center text-center justify-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4 text-sm font-semibold tracking-wide uppercase text-brand-yellow">
              {property.type && <span>{property.type}</span>}
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">{property.title}</h1>
            <div className="flex flex-wrap items-center justify-center text-zinc-500 gap-4 text-lg">
              <span className="flex items-center font-medium">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                {property.city}, {property.location}
              </span>
            </div>
          </div>
          <div>
            <div className="text-4xl font-semibold text-black">${property.price.toLocaleString()}</div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-16">
          {property.images.length > 0 ? (
            <div className="flex flex-col gap-4">
              {/* Primary Image */}
              <div className="relative w-full md:h-[600px] bg-zinc-50 flex items-center justify-center rounded-3xl overflow-hidden">
                <img 
                  src={property.images[0].url} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Secondary Images Grid */}
              {property.images.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.images.slice(1).map((img, idx) => (
                    <div key={idx} className="relative w-full md:h-[400px] rounded-2xl overflow-hidden bg-zinc-50">
                      <img 
                        src={img.url} 
                        alt={`${property.title} - view ${idx + 2}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full aspect-[21/9] bg-zinc-100 rounded-3xl flex items-center justify-center text-zinc-400">
              No Images Available
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 pb-20">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-4">About this property</h2>
              <div className="text-lg text-zinc-600 leading-relaxed whitespace-pre-line">
                {property.description}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-32 p-8 border border-zinc-200 rounded-3xl shadow-sm bg-white">
              <h3 className="text-xl font-semibold tracking-tight mb-6">Contact Agent</h3>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-full bg-brand-yellow/20 text-brand-yellow flex items-center justify-center text-xl font-bold">
                  {property.owner.firstName[0]}
                </div>
                <div>
                  <div className="font-semibold text-lg">{property.owner.firstName} {property.owner.lastName}</div>
                  <div className="text-zinc-500 text-sm mb-1">{property.email || property.owner.email}</div>
                  {property.phone && (
                    <div className="flex items-center gap-4 mt-2">
                      <a href={`tel:${property.phone}`} className="text-zinc-600 hover:text-black transition-colors text-sm flex items-center gap-1.5 font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        Call
                      </a>
                      <a href={`https://wa.me/${property.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 transition-colors text-sm flex items-center gap-1.5 font-medium">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.423-.101.827z"></path><path d="M12.031 2C6.495 2 2 6.495 2 12.03c0 1.954.551 3.791 1.516 5.34l-1.396 5.093 5.216-1.368c1.518.878 3.268 1.378 5.127 1.378h.001c5.534-.001 10.029-4.496 10.03-10.031C22.496 6.495 18.001 2 12.031 2zm0 18.21c-1.637-.001-3.239-.424-4.66-1.226l-.334-.188-3.465.908.922-3.376-.206-.328C3.472 14.619 3.013 12.986 3.013 11.286c0-4.966 4.041-9.006 9.011-9.006s9.012 4.04 9.013 9.006c-.001 4.967-4.042 9.007-9.006 9.008z"></path></svg>
                        WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <button className="w-full py-4 rounded-full bg-black text-white font-medium text-lg hover:bg-zinc-800 transition-colors shadow-sm">
                Inquire Now
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
