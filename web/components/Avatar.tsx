"use client";

import { useState } from "react";

const SIZE_CLASSES = {
  sm: "w-10 h-10 text-sm",
  md: "w-14 h-14 text-lg",
  lg: "w-24 h-24 text-3xl",
};

interface AvatarProps {
  username: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function initials(username: string) {
  return username.slice(0, 2).toUpperCase();
}

export default function Avatar({ username, avatarUrl, size = "md", className = "" }: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const sizeClass = SIZE_CLASSES[size];

  if (avatarUrl && !imgError) {
    return (
      <img
        src={avatarUrl}
        alt={username}
        onError={() => setImgError(true)}
        className={`${sizeClass} rounded-full object-cover border-2 border-[#e0a548]/30 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-[#2d1f1a] flex items-center justify-center text-[#e0a548] font-semibold ${className}`}
    >
      {initials(username)}
    </div>
  );
}
