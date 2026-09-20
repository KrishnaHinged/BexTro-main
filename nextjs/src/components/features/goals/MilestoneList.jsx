"use client";

import React from "react";
import MilestoneItem from "./MilestoneItem";

export default function MilestoneList({
  milestones = [],
  onUploadProof,
  onClimbMountain
}) {
  const completedCount = milestones.filter(m => m.completed || m.status === "completed").length;

  return (
    <div className="p-8 bg-cream-card border border-cream-dark/80 rounded-[2.8rem] shadow-xl space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50">
            Roadmap Sequence
          </span>
          <h3 className="text-xl font-serif-elegant font-normal text-charcoal">
            Sequential Milestones
          </h3>
        </div>
        <span className="text-xs font-mono font-bold text-charcoal/60 bg-white px-3 py-1 rounded-full border border-cream-dark/80">
          {completedCount} of {milestones.length} Completed
        </span>
      </div>

      <div className="space-y-3">
        {milestones.length === 0 ? (
          <p className="text-xs text-charcoal/50 italic text-center py-6">
            No milestones planned for this goal trajectory yet.
          </p>
        ) : (
          milestones.map((milestone, idx) => (
            <MilestoneItem
              key={milestone._id || idx}
              milestone={milestone}
              index={idx}
              onUploadProof={onUploadProof}
              onClimbMountain={onClimbMountain}
            />
          ))
        )}
      </div>
    </div>
  );
}
