"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("USER");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!isLoaded) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, role }),
      });

      if (res.ok) {
        router.push("/");
      } else {
        console.error("Failed to save onboarding data");
      }
    } catch (error) {
      console.error("Onboarding error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-6 selection:bg-brand-yellow selection:text-black">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="p-10">
          <h2 className="text-3xl font-semibold text-black mb-2">Welcome to Bright</h2>
          <p className="text-zinc-600 mb-8">Let's set up your profile to get started.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">First Name</label>
                <input
                  required
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-zinc-200 bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors text-black"
                  placeholder="Jane"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Last Name</label>
                <input
                  required
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-zinc-200 bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors text-black"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-black">Account Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("USER")}
                  className={`p-4 rounded-xl border transition-all text-left ${
                    role === "USER"
                      ? "border-brand-yellow bg-brand-yellow/10 text-black"
                      : "border-zinc-200 hover:border-zinc-300 text-zinc-600"
                  }`}
                >
                  <p className={`font-semibold text-lg ${role === "USER" ? "text-black" : ""}`}>Looking for property</p>
                  <p className="text-xs opacity-80 mt-1">Browse and rent/buy listings</p>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("AGENT")}
                  className={`p-4 rounded-xl border transition-all text-left ${
                    role === "AGENT"
                      ? "border-brand-yellow bg-brand-yellow/10 text-black"
                      : "border-zinc-200 hover:border-zinc-300 text-zinc-600"
                  }`}
                >
                  <p className={`font-semibold text-lg ${role === "AGENT" ? "text-black" : ""}`}>Real Estate Agent</p>
                  <p className="text-xs opacity-80 mt-1">Post and manage listings</p>
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-4 mt-4 rounded-full bg-brand-yellow text-black font-medium text-lg hover:bg-brand-yellow-hover transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Continue to Dashboard"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
