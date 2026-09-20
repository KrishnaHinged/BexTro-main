"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

export default function PageHeader({
  title,
  subtitle,
  backUrl,
  backLabel = "Back",
  tag,
  actions,
  className = ""
}) {
  const router = useRouter();

  return (
    <div className={`space-y-4 ${className}`}>
      {(backUrl || tag) && (
        <div className="flex items-center justify-between">
          {backUrl && (
            <button
              onClick={() => router.push(backUrl)}
              className="text-xs font-bold text-charcoal/60 hover:text-charcoal transition flex items-center gap-1.5 cursor-pointer font-sans-clean"
            >
              <FaArrowLeft size={10} />
              <span>{backLabel}</span>
            </button>
          )}

          {tag && (
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-white border border-cream-dark/80 rounded-full text-indigo-600 shadow-2xs font-sans-clean">
              {tag}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif-elegant font-normal text-charcoal tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-charcoal/65 font-sans-clean max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>

        {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
