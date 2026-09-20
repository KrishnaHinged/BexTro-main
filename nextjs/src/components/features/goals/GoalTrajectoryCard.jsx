"use client";

import React from "react";
import { FaBrain } from "react-icons/fa";

export default function GoalTrajectoryCard({ goal }) {
  if (!goal) return null;

  return (
    <div className="p-8 bg-cream-card border border-cream-dark/80 rounded-[2.8rem] shadow-xl space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50">
          Trajectory Architecture
        </span>
        <span className="text-sm font-extrabold text-indigo-600 font-mono">
          {goal.progress || 0}% Complete
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-cream-dark/80 rounded-2xl space-y-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-charcoal/40 tracking-wider">Start State</span>
          <p className="text-xs font-bold text-charcoal">{goal.startingState || "Initiation"}</p>
        </div>

        <div className="p-4 bg-indigo-50/70 border border-indigo-200/80 rounded-2xl space-y-1 shadow-xs relative">
          <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">Current State</span>
          <p className="text-xs font-bold text-indigo-950">{goal.currentState || "In progress execution"}</p>
        </div>

        <div className="p-4 bg-white border border-cream-dark/80 rounded-2xl space-y-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-charcoal/40 tracking-wider">Target State</span>
          <p className="text-xs font-bold text-charcoal">{goal.targetState || "Full Mastery"}</p>
        </div>
      </div>

      <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-cream-dark/80">
        <div
          className="h-full bg-charcoal rounded-full transition-all duration-700"
          style={{ width: `${goal.progress || 0}%` }}
        />
      </div>

      {/* AI Strategy Insights */}
      {goal.aiPlan?.measurableMetrics?.length > 0 && (
        <div className="p-5 bg-white/80 border border-cream-dark/80 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-indigo-600">
            <FaBrain size={12} />
            <span className="text-[11px] font-bold uppercase tracking-wider">Target Metrics</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {goal.aiPlan.measurableMetrics.map((metric, idx) => (
              <span
                key={idx}
                className="text-xs bg-cream-card px-3 py-1 rounded-full border border-cream-dark text-charcoal/80 font-mono"
              >
                {metric}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
