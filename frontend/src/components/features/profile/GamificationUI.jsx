import React from "react";
import { motion } from "framer-motion";

const GamificationUI = ({ score = 0 }) => {
  const level = Math.floor(score / 100);
  const xpInCurrentLevel = score % 100;
  const progress = xpInCurrentLevel;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative p-7 sm:p-8 rounded-[2.5rem] bg-dark-green text-sand border border-emerald-800/15 shadow-xl overflow-hidden font-sans-clean flex flex-col justify-between h-full min-h-[190px]"
    >
      {/* ✨ Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-emerald-950/10 to-teal-950/10 blur-xl"></div>

      {/* Header */}
      <div className="flex justify-between items-center mb-5 relative z-10">
        <h2 className="text-lg sm:text-xl font-serif-elegant font-normal text-white">
          ⚡ Level {level}
        </h2>
        <span className="text-xs text-sand/70 font-semibold">
          {xpInCurrentLevel}/100 XP
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative h-4 rounded-full bg-emerald-950/80 overflow-hidden border border-emerald-500/10 z-10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="h-full rounded-full bg-indigo-600 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
        ></motion.div>
      </div>

      {/* Stats */}
      <div className="flex justify-between mt-6 text-sand/80 text-sm relative z-10 border-t border-emerald-800/20 pt-4">
        <div>
          <p className="text-[10px] uppercase font-bold text-sand/40 tracking-wider mb-0.5">Total XP</p>
          <p className="font-semibold text-lg text-white">{score}</p>
        </div>

        <div className="text-right">
          <p className="text-[10px] uppercase font-bold text-sand/40 tracking-wider mb-0.5">Next Level</p>
          <p className="font-semibold text-lg text-white">{(level + 1) * 100} XP</p>
        </div>
      </div>
    </motion.div>
  );
};

export default GamificationUI;