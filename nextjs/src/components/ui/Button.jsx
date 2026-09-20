"use client";

import React from "react";

const VARIANTS = {
  primary: "bg-charcoal text-sand hover:bg-black border border-charcoal shadow-sm",
  secondary: "bg-cream-card text-charcoal hover:bg-cream border border-cream-dark/80 shadow-xs",
  darkGreen: "bg-dark-green text-sand hover:bg-dark-green/90 border border-emerald-900/40 shadow-sm",
  outline: "bg-transparent text-charcoal hover:bg-cream-card border border-cream-dark/80",
  ghost: "bg-transparent text-charcoal/70 hover:text-charcoal hover:bg-cream-card/60 border border-transparent",
  danger: "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200",
  dangerSolid: "bg-rose-600 text-white hover:bg-rose-700 border border-rose-700 shadow-xs",
  gradient: "bextro-gradient-text bg-charcoal hover:opacity-90 border border-indigo-500/20 shadow-sm",
  sand: "bg-sand hover:bg-white text-charcoal border border-cream-dark/60 shadow-xs"
};

const SIZES = {
  xs: "px-2.5 py-1 text-[11px] font-bold rounded-lg gap-1",
  sm: "px-3.5 py-1.5 text-xs font-bold rounded-full gap-1.5",
  md: "px-5 py-2.5 text-xs sm:text-sm font-bold rounded-full gap-2",
  lg: "px-7 py-3.5 text-sm sm:text-base font-bold rounded-full gap-2.5"
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  isLoading = false,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  type = "button",
  onClick,
  ...props
}) {
  const variantStyles = VARIANTS[variant] || VARIANTS.primary;
  const sizeStyles = SIZES[size] || SIZES.md;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-sans-clean transition-all duration-200 cursor-pointer select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-0.5 mr-2 h-3.5 w-3.5 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : leftIcon ? (
        <span className="shrink-0 flex items-center">{leftIcon}</span>
      ) : null}

      <span>{children}</span>

      {!isLoading && rightIcon && (
        <span className="shrink-0 flex items-center">{rightIcon}</span>
      )}
    </button>
  );
}
