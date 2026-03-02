"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface LikeButtonProps {
  propertyId: string;
  initialLikes: number;
  initialIsLiked: boolean;
  isSignedIn: boolean;
}

export default function LikeButton({ propertyId, initialLikes, initialIsLiked, isSignedIn }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLike = async () => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    // Optimistic update
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);

    try {
      const res = await fetch(`/api/properties/${propertyId}/like`, {
        method: "POST",
      });

      if (!res.ok) {
        // Revert on failure
        setIsLiked(isLiked);
        setLikesCount(isLiked ? initialLikes : initialLikes);
      } else {
        router.refresh(); // so that the server components can also refresh data
      }
    } catch (error) {
      setIsLiked(isLiked);
      setLikesCount(isLiked ? initialLikes : initialLikes);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
        isLiked 
          ? "bg-red-50 border-red-200 text-red-600" 
          : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
      }`}
    >
      <svg 
        className={`w-5 h-5 ${isLiked ? "fill-current" : "fill-none"}`} 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
      </svg>
      <span className="font-medium">{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
    </button>
  );
}
