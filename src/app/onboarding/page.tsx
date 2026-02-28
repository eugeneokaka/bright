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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-black dark:to-zinc-950 p-6">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="p-10">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Welcome to Bright</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8">Let's set up your profile to get started.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">First Name</label>
                <input
                  required
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 outline-none transition-all"
                  placeholder="Jane"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Last Name</label>
                <input
                  required
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 outline-none transition-all"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Account Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("USER")}
                  className={`p-4 rounded-xl border transition-all text-left ${
                    role === "USER"
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-black"
                      : "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  <p className="font-semibold text-lg">Looking for property</p>
                  <p className="text-xs opacity-70">Browse and rent/buy listings</p>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("AGENT")}
                  className={`p-4 rounded-xl border transition-all text-left ${
                    role === "AGENT"
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-black"
                      : "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  <p className="font-semibold text-lg">Real Estate Agent</p>
                  <p className="text-xs opacity-70">Post and manage property listings</p>
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-4 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black font-semibold text-lg hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? "Saving..." : "Continue to Dashboard"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
