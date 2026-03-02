"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [city, setCity] = useState(searchParams.get("city") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [type, setType] = useState(searchParams.get("type") || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (city) params.set("city", city); else params.delete("city");
      if (location) params.set("location", location); else params.delete("location");
      if (maxPrice) params.set("maxPrice", maxPrice); else params.delete("maxPrice");
      if (type) params.set("type", type); else params.delete("type");
      
      const newQueryString = params.toString();
      if (newQueryString !== searchParams.toString()) {
        router.push(`${pathname}?${newQueryString}`, { scroll: false });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [city, location, maxPrice, type, pathname, router, searchParams]);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto w-full">
      <input
        type="text"
        placeholder="Filter by city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="border border-zinc-200 rounded-lg px-4 py-3 flex-1 outline-none focus:ring-2 focus:ring-brand-yellow placeholder-zinc-400"
      />
      <input
        type="text"
        placeholder="Filter by location..."
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border border-zinc-200 rounded-lg px-4 py-3 flex-1 outline-none focus:ring-2 focus:ring-brand-yellow placeholder-zinc-400"
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border border-zinc-200 rounded-lg px-4 py-3 flex-1 outline-none focus:ring-2 focus:ring-brand-yellow text-zinc-800 bg-white"
      >
        <option value="">Filter by type...</option>
        <option value="Land">Land</option>
        <option value="Property">Property</option>
        <option value="Rent">Rent</option>
        <option value="Bnd">Bnd</option>
      </select>
      <input
        type="number"
        placeholder="Max price..."
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        className="border border-zinc-200 rounded-lg px-4 py-3 flex-1 outline-none focus:ring-2 focus:ring-brand-yellow placeholder-zinc-400"
      />
    </div>
  );
}
