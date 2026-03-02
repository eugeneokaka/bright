"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useState } from "react";

export default function SiteNav({ className = "" }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={`flex items-center justify-between p-6 bg-white sticky top-0 z-50 border-b border-zinc-100 ${className}`}>
      <Link href="/" className="text-2xl font-semibold tracking-tight hover:text-brand-yellow transition-colors">
        Bright
      </Link>
      
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6 font-medium">
        <SignedOut>
          <Link href="/sign-in" className="text-zinc-600 hover:text-black transition-colors">
            Sign In
          </Link>
          <Link href="/sign-up" className="bg-brand-yellow text-black px-5 py-2 rounded-full hover:bg-brand-yellow-hover transition-colors font-medium">
            Get Started
          </Link>
        </SignedOut>
        <SignedIn>
          <Link href="/dashboard" className="bg-brand-yellow text-black px-5 py-2 rounded-full hover:bg-brand-yellow-hover transition-colors font-medium text-center">
            Dashboard
          </Link>
          <Link href="/create-property" className="text-zinc-600 hover:text-black transition-colors">
            Create Listing
          </Link>
          <div className="ml-2">
            <UserButton appearance={{
              elements: { userButtonAvatarBox: "h-9 w-9" }
            }} />
          </div>
        </SignedIn>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="flex md:hidden items-center gap-4">
        <SignedIn>
          <UserButton appearance={{
            elements: { userButtonAvatarBox: "h-9 w-9" }
          }} />
        </SignedIn>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="text-zinc-600 hover:text-black p-1"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-zinc-100 shadow-lg py-4 px-6 flex flex-col gap-4 font-medium md:hidden">
          <SignedOut>
             <Link href="/sign-in" onClick={() => setIsOpen(false)} className="text-zinc-600 hover:text-black py-2 border-b border-zinc-50">
              Sign In
            </Link>
            <Link href="/sign-up" onClick={() => setIsOpen(false)} className="bg-brand-yellow text-black px-5 py-2 rounded-full hover:bg-brand-yellow-hover transition-colors text-center mt-2">
              Get Started
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-zinc-600 hover:text-black py-2 border-b border-zinc-50">
              Dashboard
            </Link>
            <Link href="/create-property" onClick={() => setIsOpen(false)} className="text-zinc-600 hover:text-black py-2">
              Create Listing
            </Link>
          </SignedIn>
        </div>
      )}
    </nav>
  );
}
