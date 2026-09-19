"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaHourglassHalf, FaCheck, FaTimes } from "react-icons/fa";

const ChallengeCard = ({ challenge, index, onComplete, onAbandon, isOwner = false }) => {
  const start = new Date(challenge.acceptedAt || Date.now());
  const end = new Date(start.getTime() + (challenge.timelineDays || 3) * 24 * 60 * 60 * 1000);
  const now = new Date();
  
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  let timeStatus = "";
  let statusColor = "";
  if (diffDays > 0) {
      timeStatus = `${diffDays} days left`;
      statusColor = "text-indigo-600 bg-indigo-50 border-indigo-200";
  } else if (diffDays === 0) {
      timeStatus = "Due Today!";
      statusColor = "text-amber-600 bg-amber-50 border-amber-200 animate-pulse";
  } else {
      timeStatus = `${Math.abs(diffDays)} days overdue`;
      statusColor = "text-rose-600 bg-rose-50 border-rose-200";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="p-6 bg-cream-card rounded-3xl shadow-sm hover:shadow-md transition-all border border-cream-dark/80 font-sans-clean flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start mb-3 gap-2">
          <h3 className="text-base font-bold text-charcoal tracking-tight flex-1 font-serif-elegant leading-snug">
            {challenge.challengeText}
          </h3>
          <span className={`text-[10px] px-3 py-1 rounded-full border shadow-xs font-bold whitespace-nowrap ${statusColor}`}>
            {timeStatus}
          </span>
        </div>
        
        <div className="flex flex-col gap-1.5 mb-5 text-xs text-charcoal/60">
          <div className="flex items-center gap-2">
            <span className="w-16 font-bold text-charcoal/40 text-[11px] uppercase">Start:</span>
            <span>{start.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-16 font-bold text-charcoal/40 text-[11px] uppercase">Deadline:</span>
            <span className="font-bold text-charcoal">{end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {isOwner ? (
        <div className="flex gap-2.5 pt-3 border-t border-cream-dark/50">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onComplete && onComplete(challenge, index)}
            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FaCheck size={10} />
            <span>Complete</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAbandon && onAbandon(challenge, index)}
            className="flex-1 py-2.5 bg-white border border-cream-dark/80 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FaTimes size={10} />
            <span>Abandon</span>
          </motion.button>
        </div>
      ) : (
        <div className="pt-3 border-t border-cream-dark/50 flex items-center justify-between text-xs text-charcoal/50">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
            <FaHourglassHalf size={10} />
            <span>Active Target</span>
          </span>
          <span className="text-[10px] text-charcoal/40 font-medium">View Only</span>
        </div>
      )}
    </motion.div>
  );
};

export default ChallengeCard;
