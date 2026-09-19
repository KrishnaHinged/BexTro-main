"use client";

import React from "react";
import { motion } from "framer-motion";

const FeedbackModal = ({ show, feedback, setFeedback, onSubmit, onCancel, challengeName, userName }) => {
  if (!show) return null;

  const handleSubmit = () => {
    const timestamp = new Date().toLocaleString();
    onSubmit({ feedback, challengeName, userName, timestamp });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 font-sans-clean">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-cream-card border border-cream-dark/80 rounded-3xl p-6 shadow-2xl w-full max-w-md"
      >
        <h3 className="text-xl font-serif-elegant text-charcoal mb-4">Share Your Experience</h3>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full p-3 bg-white border border-cream-dark/80 rounded-xl focus:outline-none focus:border-indigo-500 mb-4 resize-none h-32 text-xs text-charcoal"
          placeholder={`How did ${challengeName} feel?`}
        />
        <div className="flex gap-3 justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-charcoal text-white rounded-full text-xs font-bold hover:bg-black transition-colors cursor-pointer"
          >
            Submit
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            className="px-5 py-2.5 bg-white border border-cream-dark text-charcoal/70 rounded-full text-xs font-bold hover:bg-cream transition-colors cursor-pointer"
          >
            Cancel
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default FeedbackModal;
