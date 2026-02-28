import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-brand-yellow selection:text-black pb-20">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 bg-white sticky top-0 z-50 border-b border-zinc-100">
        <div className="text-2xl font-semibold tracking-tight">Bright</div>
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
            <UserButton appearance={{
              elements: { userButtonAvatarBox: "h-9 w-9" }
            }} />
          </SignedIn>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center pt-32 px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-tight mb-6 max-w-4xl">
          Beautifully simple. <br className="hidden md:block" />
          <span className="text-zinc-400">Powerfully bright.</span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-600 max-w-2xl mb-12 leading-relaxed">
          The ultimate platform for modern creators. Minimalist design, seamless functionality, and zero distractions.
        </p>
        
        <SignedOut>
          <Link href="/sign-up" className="inline-block bg-brand-yellow text-black text-lg font-medium px-8 py-4 rounded-full shadow-sm hover:bg-brand-yellow-hover hover:shadow-md transition-all">
            Start Building Free
          </Link>
        </SignedOut>
        <SignedIn>
           <Link href="/onboarding" className="inline-block bg-brand-yellow text-black text-lg font-medium px-8 py-4 rounded-full shadow-sm hover:bg-brand-yellow-hover hover:shadow-md transition-all">
              Go to Dashboard
            </Link>
        </SignedIn>

        {/* Features / Grid area */}
        <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-6xl text-left">
          {[
            { title: "Lightning Fast", desc: "Built on modern frameworks for uncompromised speed and silky smooth performance." },
            { title: "Secure Authentication", desc: "Enterprise-grade security built-in with scalable, reliable infrastructure." },
            { title: "Minimalist Aesthetic", desc: "Clean white design allowing your rich content to take center stage." }
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-start p-6 rounded-2xl border border-zinc-100 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-brand-yellow/20 text-brand-yellow rounded-xl flex items-center justify-center mb-5">
                 <div className="w-5 h-5 rounded-full bg-brand-yellow"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-zinc-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

