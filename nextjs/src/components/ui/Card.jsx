"use client";

import React from "react";

export function Card({
  children,
  className = "",
  variant = "cream",
  hover = false,
  ...props
}) {
  const variants = {
    cream: "bg-cream-card border-cream-dark/80 text-charcoal",
    white: "bg-white border-cream-dark/80 text-charcoal",
    darkGreen: "bg-dark-green border-emerald-900/40 text-sand",
    charcoal: "bg-charcoal border-charcoal/80 text-sand"
  };

  const selectedVariant = variants[variant] || variants.cream;
  const hoverClass = hover ? "hover:shadow-md hover:border-charcoal/30 transition-all duration-200" : "";

  return (
    <div
      className={`rounded-[2rem] border shadow-sm p-6 relative ${selectedVariant} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "", ...props }) {
  return (
    <div className={`mb-4 space-y-1.5 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "", as = "h3", ...props }) {
  const Component = as;
  return (
    <Component
      className={`text-xl font-serif-elegant font-normal tracking-tight ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardDescription({ children, className = "", ...props }) {
  return (
    <p className={`text-xs sm:text-sm text-charcoal/65 font-sans-clean ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = "", ...props }) {
  return (
    <div className={`font-sans-clean ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = "", ...props }) {
  return (
    <div className={`mt-5 pt-4 border-t border-cream-dark/60 flex items-center justify-between ${className}`} {...props}>
      {children}
    </div>
  );
}
