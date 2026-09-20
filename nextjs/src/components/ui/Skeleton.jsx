"use client";

import React from "react";

export default function Skeleton({
  className = "",
  variant = "rectangular", // "text" | "circular" | "rectangular"
  width,
  height
}) {
  const variantStyles = {
    text: "h-4 rounded-md",
    circular: "rounded-full",
    rectangular: "rounded-2xl"
  };

  const style = {
    width: width,
    height: height
  };

  return (
    <div
      style={style}
      className={`animate-pulse bg-charcoal/10 ${variantStyles[variant] || variantStyles.rectangular} ${className}`}
    />
  );
}
