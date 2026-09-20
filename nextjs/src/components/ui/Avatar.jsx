"use client";

import React, { useState } from "react";
import { ROOT_URL } from "@/api/axios";

const SIZES = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
  "2xl": "w-24 h-24 text-2xl"
};

export default function Avatar({
  src,
  alt = "User Avatar",
  name = "",
  size = "md",
  className = "",
  status = null, // "online" | "offline" | null
  ...props
}) {
  const [imgError, setImgError] = useState(false);

  const getInitials = (str) => {
    if (!str) return "U";
    const parts = str.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const resolvedSrc = src
    ? src.startsWith("http") || src.startsWith("data:") || src.startsWith("/")
      ? src
      : `${ROOT_URL}/${src.replace(/^\/+/, "")}`
    : null;

  const sizeClass = SIZES[size] || SIZES.md;

  return (
    <div className={`relative inline-block shrink-0 ${className}`} {...props}>
      <div
        className={`rounded-full overflow-hidden flex items-center justify-center font-bold select-none border border-cream-dark/80 bg-sand text-charcoal shadow-2xs ${sizeClass}`}
      >
        {resolvedSrc && !imgError ? (
          <img
            src={resolvedSrc}
            alt={alt}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{getInitials(name || alt)}</span>
        )}
      </div>

      {status && (
        <span
          className={`absolute bottom-0 right-0 block rounded-full ring-2 ring-cream ${
            status === "online" ? "bg-emerald-500" : "bg-charcoal/30"
          } ${size === "xs" || size === "sm" ? "w-2 h-2" : "w-3 h-3"}`}
        />
      )}
    </div>
  );
}
