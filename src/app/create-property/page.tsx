"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/utils/uploadthing";

export default function CreatePropertyPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [images, setImages] = useState<{ url: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      alert("Please upload at least one image before submitting.");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          price: parseFloat(price),
          location,
          city,
          type: type || null,
          phone: phone || null,
          email: email || null,
          images,
        }),
      });

      if (res.ok) {
        router.push("/");
      } else {
        console.error("Failed to create property");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-6 font-sans selection:bg-brand-yellow selection:text-black">
      <nav className="flex items-center justify-between py-4 mb-12 border-b border-zinc-100 max-w-4xl mx-auto">
        <div className="text-2xl font-semibold tracking-tight">Bright</div>
        <button onClick={() => router.back()} className="text-zinc-600 hover:text-black font-medium transition-colors">
          Cancel
        </button>
      </nav>

      <main className="max-w-2xl mx-auto pb-20">
        <h1 className="text-4xl font-semibold tracking-tight mb-2">Create New Listing</h1>
        <p className="text-zinc-500 mb-10">Fill out the details below to add a new property to the market.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-black">Title</label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Modern Downtown Apartment"
                className="w-full px-4 py-3 rounded-md border border-zinc-200 bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-black">Description</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the key features of the property..."
                className="w-full px-4 py-3 rounded-md border border-zinc-200 bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Price (Ksh)</label>
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="2500"
                  className="w-full px-4 py-3 rounded-md border border-zinc-200 bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Location</label>
                <input
                  required
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="New York, NY"
                  className="w-full px-4 py-3 rounded-md border border-zinc-200 bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">City</label>
                <input
                  required
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Manhattan"
                  className="w-full px-4 py-3 rounded-md border border-zinc-200 bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Property Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-zinc-200 bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors"
                >
                  <option value="">Select Type (Optional)</option>
                  <option value="Land">Land</option>
                  <option value="Property">Property</option>
                  <option value="Rent">Rent</option>
                  <option value="Bnd">Bnd</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Contact Email (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@bright.com"
                  className="w-full px-4 py-3 rounded-md border border-zinc-200 bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Contact Phone (Optional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 rounded-md border border-zinc-200 bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-100">
            <h3 className="text-lg font-semibold">Property Images</h3>
            <p className="text-sm text-zinc-500">Upload up to 5 images showing off the property.</p>
            
            {images.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 mb-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-200">
                    <img src={img.url} alt={`Upload ${idx + 1}`} className="object-cover w-full h-full" />
                  </div>
                ))}
              </div>
            ) : null}

            <UploadDropzone
              endpoint="propertyImageUploader"
              appearance={{
                container: "border-2 border-dashed border-zinc-200 hover:border-brand-yellow transition-colors rounded-xl bg-zinc-50/50 p-8",
                button: "bg-brand-yellow text-black font-medium hover:bg-brand-yellow-hover mt-4 text-sm px-4 py-2 rounded-md ut-uploading:bg-brand-yellow/50 after:bg-brand-yellow-hover",
                label: "text-zinc-800 font-semibold text-lg hover:text-brand-yellow-hover transition-colors",
                allowedContent: "text-zinc-500 text-sm mt-2",
              }}
              onClientUploadComplete={(res) => {
                const uploadedImages = res.map(file => ({ url: file.url }));
                setImages((prev) => [...prev, ...uploadedImages]);
              }}
              onUploadError={(error: Error) => {
                alert(`Upload failed: ${error.message}`);
              }}
            />
          </div>

          <button
            disabled={loading || images.length === 0}
            type="submit"
            className="w-full py-4 rounded-full bg-brand-yellow text-black font-medium text-lg hover:bg-brand-yellow-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md mt-8"
          >
            {loading ? "Creating Listing..." : "Publish Listing"}
          </button>
        </form>
      </main>
    </div>
  );
}
