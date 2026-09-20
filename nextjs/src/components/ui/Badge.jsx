"use client";

import React from "react";

const BADGE_VARIANTS = {
  emerald: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500"
  },
  indigo: {
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dot: "bg-indigo-500"
  },
  amber: {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500"
  },
  rose: {
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500"
  },
  cyan: {
    badge: "bg-cyan-50 text-cyan-700 border-cyan-200",
    dot: "bg-cyan-500"
  },
  violet: {
    badge: "bg-violet-50 text-violet-700 border-violet-200",
    dot: "bg-violet-500"
  },
  neutral: {
    badge: "bg-cream-card text-charcoal/70 border-cream-dark/80",
    dot: "bg-charcoal/40"
  },
  dark: {
    badge: "bg-charcoal text-sand border-charcoal/80",
    dot: "bg-emerald-400"
  }
};

export default function Badge({
  children,
  variant = "neutral",
  size = "md",
  dot = false,
  className = "",
  ...props
}) {
  const selected = BADGE_VARIANTS[variant] || BADGE_VARIANTS.neutral;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3.5 py-1.5 text-xs font-bold"
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-sans-clean font-bold rounded-full border shadow-2xs select-none ${selected.badge} ${sizeClasses[size] || sizeClasses.md} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full shrink-0 ${selected.dot}`}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
}
