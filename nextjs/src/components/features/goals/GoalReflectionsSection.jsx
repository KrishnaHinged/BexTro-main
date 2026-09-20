"use client";

import React from "react";
import { ROOT_URL } from "@/api/axios";

export default function GoalReflectionsSection({
  milestonesWithProof = [],
  completedTasksWithProof = []
}) {
  const hasContent = milestonesWithProof.length > 0 || completedTasksWithProof.length > 0;
  if (!hasContent) return null;

  return (
    <div className="p-8 bg-cream-card border border-cream-dark/80 rounded-[2.8rem] shadow-xl space-y-6">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50">
          Proof & Reflection Log
        </span>
        <h3 className="text-xl font-serif-elegant font-normal text-charcoal">
          Captured Milestones & Actions
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {milestonesWithProof.map((m, idx) => {
          const proofUrl = m.proofUrl || m.proof?.proofUrl;
          const resolvedProofUrl = proofUrl
            ? proofUrl.startsWith("http") || proofUrl.startsWith("data:")
              ? proofUrl
              : `${ROOT_URL}/${proofUrl.replace(/^\/+/, "")}`
            : null;

          return (
            <div
              key={idx}
              className="p-4 bg-white border border-cream-dark/80 rounded-2xl shadow-xs space-y-2"
            >
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-emerald-800">{m.title}</span>
                <span className="text-[10px] text-charcoal/40 font-mono">
                  Milestone Verified
                </span>
              </div>

              {resolvedProofUrl && (
                <img
                  src={resolvedProofUrl}
                  alt="Proof Screenshot"
                  className="max-h-48 w-full rounded-xl object-contain bg-black/5 border border-cream-dark shadow-2xs"
                />
              )}

              {(m.proofText || m.proof?.proofText) && (
                <p className="text-xs text-charcoal/70 bg-cream/40 p-2.5 rounded-xl border border-cream-dark/40 font-mono">
                  {m.proofText || m.proof?.proofText}
                </p>
              )}
            </div>
          );
        })}

        {completedTasksWithProof.map((task, idx) => (
          <div
            key={idx}
            className="p-4 bg-white border border-cream-dark/80 rounded-2xl shadow-xs space-y-1.5"
          >
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-charcoal">{task.title}</span>
              <span className="text-[10px] text-charcoal/40 font-mono">
                {task.completedAt
                  ? new Date(task.completedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric"
                    })
                  : "Completed"}
              </span>
            </div>

            {task.completionProof?.proofText && (
              <p className="text-xs text-charcoal/70 bg-cream/40 p-2.5 rounded-xl border border-cream-dark/40 font-mono">
                {task.completionProof.proofText}
              </p>
            )}

            {task.reflectionNote && (
              <p className="text-[11px] text-charcoal/60 italic">
                Reflection: &quot;{task.reflectionNote}&quot;
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
