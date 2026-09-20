"use client";

import React from "react";

export default function Input({
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  className = "",
  id,
  type = "text",
  disabled = false,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full space-y-1.5 font-sans-clean">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-bold text-charcoal/80 uppercase tracking-wider"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-charcoal/40">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          type={type}
          disabled={disabled}
          className={`w-full rounded-2xl bg-white border px-4 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 transition-all outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:bg-cream-card/60 ${
            leftIcon ? "pl-10" : ""
          } ${rightIcon ? "pr-10" : ""} ${
            error
              ? "border-rose-400 focus:border-rose-500"
              : "border-cream-dark/80 focus:border-charcoal/40"
          } ${className}`}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3.5 flex items-center text-charcoal/40">
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs font-medium text-rose-600">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-charcoal/50">{helperText}</p>
      ) : null}
    </div>
  );
}
