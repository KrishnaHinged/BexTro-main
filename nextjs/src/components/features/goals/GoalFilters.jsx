"use client";

import React from "react";

const FILTER_TABS = [
  { id: "active", label: "Active" },
  { id: "completed", label: "Achieved" },
  { id: "paused", label: "Paused" },
  { id: "all", label: "All Trajectories" }
];

export default function GoalFilters({ currentFilter, onSelectFilter }) {
  return (
    <div className="flex flex-wrap items-center gap-2 p-1.5 bg-cream-card border border-cream-dark/80 rounded-full w-fit">
      {FILTER_TABS.map((tab) => {
        const isActive = currentFilter === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectFilter(tab.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer select-none ${
              isActive
                ? "bg-charcoal text-white shadow-xs"
                : "text-charcoal/60 hover:text-charcoal hover:bg-cream/80"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
