"use client";

import React from "react";
import { FaBullseye, FaFlagCheckered, FaBolt, FaChartLine } from "react-icons/fa";

export default function GoalStatsCards({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="p-5 bg-cream-card border border-cream-dark/80 rounded-[2rem] shadow-xs space-y-2">
        <div className="flex items-center justify-between text-charcoal/50">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Active</span>
          <FaBullseye size={13} className="text-indigo-600" />
        </div>
        <p className="text-2xl sm:text-3xl font-extrabold text-charcoal font-mono">
          {stats.activeCount || 0}
        </p>
        <span className="text-[10px] text-charcoal/50">In active execution</span>
      </div>

      <div className="p-5 bg-cream-card border border-cream-dark/80 rounded-[2rem] shadow-xs space-y-2">
        <div className="flex items-center justify-between text-charcoal/50">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Achieved</span>
          <FaFlagCheckered size={13} className="text-emerald-600" />
        </div>
        <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono">
          {stats.completedCount || 0}
        </p>
        <span className="text-[10px] text-emerald-700/70 font-bold">Mountains climbed</span>
      </div>

      <div className="p-5 bg-cream-card border border-cream-dark/80 rounded-[2rem] shadow-xs space-y-2">
        <div className="flex items-center justify-between text-charcoal/50">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Milestones</span>
          <FaBolt size={13} className="text-amber-500" />
        </div>
        <p className="text-2xl sm:text-3xl font-extrabold text-charcoal font-mono">
          {stats.totalMilestonesCompleted || 0}
        </p>
        <span className="text-[10px] text-charcoal/50">Verified proofs</span>
      </div>

      <div className="p-5 bg-cream-card border border-cream-dark/80 rounded-[2rem] shadow-xs space-y-2">
        <div className="flex items-center justify-between text-charcoal/50">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Avg Progress</span>
          <FaChartLine size={13} className="text-violet-600" />
        </div>
        <p className="text-2xl sm:text-3xl font-extrabold text-indigo-950 font-mono">
          {stats.avgProgress || 0}%
        </p>
        <span className="text-[10px] text-charcoal/50">Across portfolio</span>
      </div>
    </div>
  );
}
