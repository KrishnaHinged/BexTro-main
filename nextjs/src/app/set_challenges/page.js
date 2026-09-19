"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Challenges from "@/components/features/challenge/Challenges";

export default function IntroToChallenges() {
    const [showText, setShowText] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowText(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-cream text-charcoal font-sans-clean p-6 relative overflow-hidden">
            <AnimatePresence>
                {showText && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 1 }}
                        className="w-full max-w-xl bg-cream-card text-charcoal rounded-[2.5rem] shadow-xl p-8 sm:p-10 text-center border border-cream-dark/80"
                    >
                        <h1 className="text-3xl sm:text-4xl font-serif-elegant font-normal mb-4 text-charcoal">
                            Your Journey Starts Now<span className="text-indigo-600">.</span>
                        </h1>
                        <p className="text-sm sm:text-base leading-relaxed text-charcoal/70">
                            To start something new is always a challenge, but remember, every expert was once a beginner.
                        </p>
                        <p className="text-indigo-600 font-bold mt-4 font-serif-elegant italic">— BeXtro</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {!showText && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                    className="w-full h-full flex justify-center items-center overflow-hidden"
                >
                    <Challenges />
                </motion.div>
            )}
        </div>
    );
}
