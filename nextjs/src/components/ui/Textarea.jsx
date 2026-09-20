"use client";

import React from "react";

export default function Textarea({
  label,
  helperText,
  error,
  className = "",
  id,
  rows = 3,
  disabled = false,
  ...props
}) {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full space-y-1.5 font-sans-clean">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-xs font-bold text-charcoal/80 uppercase tracking-wider"
        >
          {label}
        </label>
      )}

      <textarea
        id={textareaId}
        rows={rows}
        disabled={disabled}
        className={`w-full rounded-2xl bg-white border px-4 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 transition-all outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:bg-cream-card/60 resize-y ${
          error
            ? "border-rose-400 focus:border-rose-500"
            : "border-cream-dark/80 focus:border-charcoal/40"
        } ${className}`}
        {...props}
      />

      {error ? (
        <p className="text-xs font-medium text-rose-600">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-charcoal/50">{helperText}</p>
      ) : null}
    </div>
  );
}
