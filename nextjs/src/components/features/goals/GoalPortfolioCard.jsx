"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  FaCalendarAlt, 
  FaArrowRight, 
  FaTrashAlt, 
  FaPauseCircle, 
  FaPlayCircle 
} from "react-icons/fa";

const CATEGORY_COLORS = {
  Career: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Fitness: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Finance: "bg-amber-50 text-amber-700 border-amber-200",
  Education: "bg-cyan-50 text-cyan-700 border-cyan-200",
  Personal: "bg-violet-50 text-violet-700 border-violet-200",
  Creativity: "bg-rose-50 text-rose-700 border-rose-200",
  Skills: "bg-teal-50 text-teal-700 border-teal-200",
  Relationships: "bg-pink-50 text-pink-700 border-pink-200"
};

const MOMENTUM_STYLES = {
  Accelerating: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    label: "Accelerating 🔥"
  },
  Strong: {
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dot: "bg-indigo-500",
    label: "Strong Pace ⚡"
  },
  Steady: {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    label: "Steady 🎯"
  },
  "At Risk": {
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
    label: "Needs Attention ⚠️"
  }
};

export default function GoalPortfolioCard({
  goal,
  onToggleStatus,
  onDelete,
  isDeleting
}) {
  const router = useRouter();

  const momentum = MOMENTUM_STYLES[goal.momentum] || MOMENTUM_STYLES.Steady;
  const categoryClass = CATEGORY_COLORS[goal.category] || "bg-cream text-charcoal border-cream-dark";
  const completedMilestones = goal.milestones?.filter(m => m.completed || m.status === "completed") || [];
  const totalMilestones = goal.milestones?.length || 0;
  const nextPendingMilestone = goal.milestones?.find(m => !m.completed && m.status !== "completed");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={() => router.push(`/goals/${goal._id}`)}
      className="p-6 bg-cream-card hover:bg-white border border-cream-dark/80 hover:border-charcoal/30 rounded-[2.5rem] shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
    >
      <div className="space-y-4">
        {/* Badges & Actions */}
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border shadow-2xs ${categoryClass}`}>
            {goal.category}
          </span>

          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={(e) => onToggleStatus(e, goal)}
              title={goal.status === "paused" ? "Reactivate Goal" : "Pause Goal"}
              className="p-1.5 text-charcoal/40 hover:text-charcoal hover:bg-cream rounded-full transition cursor-pointer"
            >
              {goal.status === "paused" ? <FaPlayCircle size={15} /> : <FaPauseCircle size={15} />}
            </button>

            <button
              onClick={(e) => onDelete(e, goal._id)}
              disabled={isDeleting}
              title="Delete Goal"
              className="p-1.5 text-charcoal/40 hover:text-rose-600 hover:bg-rose-50 rounded-full transition cursor-pointer"
            >
              <FaTrashAlt size={13} />
            </button>
          </div>
        </div>

        {/* Title & Motivation */}
        <div className="space-y-1">
          <h3 className="text-xl font-serif-elegant font-normal text-charcoal group-hover:text-indigo-950 transition">
            {goal.title}
          </h3>
          {goal.motivation && (
            <p className="text-xs text-charcoal/60 italic font-serif-elegant line-clamp-2">
              &quot;{goal.motivation}&quot;
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-charcoal/50 text-[11px]">Trajectory Progress</span>
            <span className="text-indigo-600 font-mono">{goal.progress || 0}%</span>
          </div>
          <div className="w-full h-2 bg-cream rounded-full overflow-hidden border border-cream-dark/60">
            <div
              className="h-full bg-charcoal rounded-full transition-all duration-500"
              style={{ width: `${goal.progress || 0}%` }}
            />
          </div>
        </div>

        {/* Next Mountain Milestone */}
        {nextPendingMilestone && (
          <div className="p-3 bg-white/70 border border-cream-dark/60 rounded-2xl space-y-0.5">
            <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-wider">Next Mountain</span>
            <p className="text-xs font-bold text-charcoal truncate">{nextPendingMilestone.title}</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-cream-dark/60 flex items-center justify-between text-xs">
        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${momentum.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${momentum.dot}`} />
          <span>{momentum.label}</span>
        </span>

        <div className="flex items-center gap-2 text-charcoal/60 group-hover:text-charcoal transition">
          <span className="text-[11px] font-mono font-bold">
            {completedMilestones.length}/{totalMilestones} Milestones
          </span>
          <FaArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}
