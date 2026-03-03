"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/utils/uploadthing";
import { Property, Image } from "@/generated/prisma";

type PropertyWithImages = Property & { images: Image[] };

export default function EditPropertyForm({ property }: { property: PropertyWithImages }) {
  const router = useRouter();
  const [title, setTitle] = useState(property.title);
  const [description, setDescription] = useState(property.description);
  const [price, setPrice] = useState(property.price.toString());
  const [location, setLocation] = useState(property.location);
  const [city, setCity] = useState(property.city);
  const [type, setType] = useState(property.type || "");
  const [phone, setPhone] = useState(property.phone || "");
  const [email, setEmail] = useState(property.email || "");
  
  // Track images: those already from DB and those newly uploaded
  const [images, setImages] = useState<{ url: string }[]>(
    property.images.map(img => ({ url: img.url }))
  );
  
  const [loading, setLoading] = useState(false);

  const handleRemoveImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      alert("Please have at least one image attached to the property.");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch(`/api/properties/${property.id}`, {
        method: "PUT",
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
          images, // send the current state of images
        }),
      });

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        console.error("Failed to update property");
        alert("Failed to update property.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while updating.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
            <label className="text-sm font-medium text-black">Price ($)</label>
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
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Property Images</h3>
            <p className="text-sm text-zinc-500">Manage images for your property.</p>
          </div>
          <span className="text-sm font-medium bg-zinc-100 px-3 py-1 rounded-full">{images.length} / 5</span>
        </div>
        
        {images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-200 group">
                <img src={img.url} alt={`Upload ${idx + 1}`} className="object-cover w-full h-full" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-2 right-2 bg-white/90 text-red-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white"
                  aria-label="Remove image"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            ))}
          </div>
        ) : null}

        {images.length < 5 && (
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
              // Prevent exceeding 5 images total if they upload multiple at once
              setImages((prev) => {
                const combined = [...prev, ...uploadedImages];
                return combined.slice(0, 5);
              });
            }}
            onUploadError={(error: Error) => {
              alert(`Upload failed: ${error.message}`);
            }}
          />
        )}
      </div>

      <div className="pt-6">
        <button
          disabled={loading || images.length === 0}
          type="submit"
          className="w-full py-4 rounded-full bg-brand-yellow text-black font-medium text-lg hover:bg-brand-yellow-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
        >
          {loading ? "Saving Changes..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
