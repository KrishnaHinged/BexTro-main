"use client";

import React from "react";
import { motion } from "framer-motion";

const CustomChallengeInput = ({ customChallenge, setCustomChallenge, handleAddCustomChallenge }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="w-full max-w-3xl mx-auto mb-12 bg-cream-card border border-cream-dark/80 p-6 rounded-3xl shadow-sm"
    >
        <h2 className="text-xl font-serif-elegant font-normal text-charcoal mb-4">Craft Your Challenge</h2>
        <div className="flex flex-col sm:flex-row gap-3">
            <input
                type="text"
                value={customChallenge}
                onChange={(e) => setCustomChallenge(e.target.value)}
                placeholder="e.g., 'Run 5km this week'"
                className="flex-1 p-3.5 rounded-2xl bg-white border border-cream-dark/80 text-charcoal placeholder-charcoal/30 text-xs font-medium focus:outline-none focus:border-indigo-500 transition-all shadow-xs"
                onKeyPress={(e) => e.key === "Enter" && handleAddCustomChallenge()}
            />
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddCustomChallenge}
                className="px-6 py-3 bg-charcoal hover:bg-black text-white rounded-2xl shadow-sm hover:shadow-md transition-all text-xs font-bold cursor-pointer"
            >
                Add
            </motion.button>
        </div>
        <p className="mt-2 text-xs text-charcoal/50">Keep it 5+ characters!</p>
    </motion.div>
);

export default CustomChallengeInput;
