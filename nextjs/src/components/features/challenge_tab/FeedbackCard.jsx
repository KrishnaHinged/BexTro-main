"use client";

import React from 'react';
import { motion } from 'framer-motion';

const FeedbackCard = ({ userName, timestamp, challengeName, feedback }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-4 shadow-sm border border-cream-dark/80"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-semibold text-charcoal text-xs">{userName || "Anonymous"}</h4>
          <p className="text-[10px] text-charcoal/40">{timestamp}</p>
        </div>
        <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
          {challengeName}
        </span>
      </div>
      <p className="text-xs text-charcoal/70">{feedback}</p>
    </motion.div>
  );
};

export default FeedbackCard;
