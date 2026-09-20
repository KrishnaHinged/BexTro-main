"use client";

import React from "react";
import Button from "./Button";

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = ""
}) {
  return (
    <div
      className={`p-10 text-center rounded-[2.5rem] bg-cream-card border border-cream-dark/80 max-w-lg mx-auto space-y-4 my-6 shadow-sm ${className}`}
    >
      {icon && (
        <div className="w-16 h-16 mx-auto rounded-3xl bg-sand/70 border border-cream-dark flex items-center justify-center text-charcoal/60 text-2xl shadow-inner">
          {icon}
        </div>
      )}

      <div className="space-y-1">
        <h3 className="text-xl font-serif-elegant font-normal text-charcoal">
          {title}
        </h3>
        {description && (
          <p className="text-xs sm:text-sm text-charcoal/60 font-sans-clean max-w-sm mx-auto">
            {description}
          </p>
        )}
      </div>

      {actionLabel && onAction && (
        <div className="pt-2">
          <Button variant="primary" size="md" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
