"use client";

import React from "react";
import { ROOT_URL } from "@/api/axios";
import { 
  FaCheck, 
  FaMountain, 
  FaUpload, 
  FaPlay, 
  FaExternalLinkAlt 
} from "react-icons/fa";

export default function MilestoneItem({
  milestone,
  index,
  onUploadProof,
  onClimbMountain
}) {
  const isCompleted = milestone.completed || milestone.status === "completed";
  const proofUrl = milestone.proofUrl || milestone.proof?.proofUrl;

  const resolvedProofUrl = proofUrl
    ? proofUrl.startsWith("http") || proofUrl.startsWith("data:")
      ? proofUrl
      : `${ROOT_URL}/${proofUrl.replace(/^\/+/, "")}`
    : null;

  return (
    <div
      className={`p-6 border rounded-[2rem] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isCompleted
          ? "bg-emerald-50/40 border-emerald-200/80 shadow-2xs"
          : "bg-white border-cream-dark/80 shadow-xs hover:border-charcoal/30"
      }`}
    >
      <div className="space-y-1.5 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center font-mono ${
              isCompleted
                ? "bg-emerald-600 text-white"
                : "bg-cream-dark/60 text-charcoal/60"
            }`}
          >
            {isCompleted ? <FaCheck size={9} /> : index + 1}
          </span>
          <h4
            className={`text-base font-bold ${
              isCompleted ? "line-through text-charcoal/50" : "text-charcoal"
            }`}
          >
            {milestone.title}
          </h4>
        </div>

        {milestone.keyDeliverable && (
          <p className="text-xs text-charcoal/70 pl-8">
            Deliverable: <span className="font-bold text-charcoal">{milestone.keyDeliverable}</span>
          </p>
        )}

        {milestone.targetTimeframe && (
          <span className="text-[10px] font-mono text-charcoal/50 pl-8 block">
            Target: {milestone.targetTimeframe}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 pl-8 md:pl-0 shrink-0">
        {isCompleted ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <FaCheck size={9} /> Verified Climax
            </span>

            {resolvedProofUrl && (
              <a
                href={resolvedProofUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-white text-charcoal/60 hover:text-charcoal border border-cream-dark rounded-full transition cursor-pointer"
                title="View Uploaded Proof"
              >
                <FaExternalLinkAlt size={10} />
              </a>
            )}
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onUploadProof(milestone)}
              className="px-4 py-2 bg-cream-card hover:bg-cream border border-cream-dark text-charcoal text-xs font-bold rounded-full transition cursor-pointer flex items-center gap-1.5"
            >
              <FaUpload size={10} />
              <span>Proof</span>
            </button>

            <button
              type="button"
              onClick={() => onClimbMountain(milestone)}
              className="px-4 py-2 bg-charcoal hover:bg-black text-white text-xs font-bold rounded-full transition cursor-pointer flex items-center gap-1.5"
            >
              <span>Climb</span>
              <FaPlay size={9} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
