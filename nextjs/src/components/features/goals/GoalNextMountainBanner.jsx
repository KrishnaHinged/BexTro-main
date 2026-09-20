"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaMountain, FaUpload, FaPlay } from "react-icons/fa";

export default function GoalNextMountainBanner({
  milestone,
  onUploadProof,
  onClimbMountain
}) {
  if (!milestone) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-dark-green text-sand border border-emerald-800/30 rounded-[2.5rem] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <FaMountain size={12} className="text-emerald-400" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
            What is the next mountain?
          </span>
        </div>
        <h3 className="text-lg font-serif-elegant text-white">
          {milestone.title}
        </h3>
        {milestone.keyDeliverable && (
          <p className="text-xs text-sand/70">
            Deliverable: <strong className="text-sand">{milestone.keyDeliverable}</strong>
          </p>
        )}
      </div>

      <div className="flex items-center gap-2.5 self-start sm:self-center">
        <button
          type="button"
          onClick={() => onUploadProof(milestone)}
          className="px-5 py-2.5 bg-emerald-800/80 hover:bg-emerald-700 text-sand text-xs font-bold rounded-full border border-emerald-600/40 shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
        >
          <FaUpload size={10} />
          <span>Upload Proof</span>
        </button>

        <button
          type="button"
          onClick={() => onClimbMountain(milestone)}
          className="px-6 py-2.5 bg-sand hover:bg-white text-charcoal text-xs font-bold rounded-full shadow-md transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap"
        >
          <span>Climb Mountain</span>
          <FaPlay size={9} />
        </button>
      </div>
    </motion.div>
  );
}
