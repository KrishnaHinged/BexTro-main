"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/api/axios";
import { toast } from "react-hot-toast";
import { FaCheck, FaFire, FaBolt } from "react-icons/fa";

const ReflectionModal = ({ task, actualMinutes, initialNotes = "", onClose, onCompleted }) => {
    const [whatAccomplished, setWhatAccomplished] = useState(task?.title || "");
    const [difficultyRating, setDifficultyRating] = useState(3);
    const [movedCloserToGoal, setMovedCloserToGoal] = useState(true);
    const [reflectionNote, setReflectionNote] = useState(initialNotes || "");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (task?._id) {
                await axiosInstance.post(`/tasks/${task._id}/complete`, {
                    actualDurationMinutes: actualMinutes || task.timeBlockMinutes || 30,
                    difficultyRating,
                    proofText: whatAccomplished,
                    reflectionNote,
                    movedCloserToGoal
                });
            } else {
                // Generic reflection
                await axiosInstance.post("/reflections", {
                    whatAccomplished,
                    difficultyRating,
                    movedCloserToGoal,
                    keyInsight: reflectionNote
                });
            }

            toast.success("Execution & proof verified! +50 XP");
            if (onCompleted) onCompleted();
            onClose();
        } catch (error) {
            console.error("Complete task error:", error);
            toast.error("Failed to record completion proof");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 font-sans-clean"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-cream-card border border-cream-dark/80 rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl space-y-6 relative"
                >
                    <div className="text-center space-y-1">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-xl font-bold shadow-sm">
                            <FaCheck size={18} />
                        </div>
                        <h2 className="text-2xl font-serif-elegant font-normal text-charcoal pt-2">
                            Session Complete
                        </h2>
                        <p className="text-charcoal/50 text-xs font-medium">
                            15-second verification. Let your progress speak.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 ml-1 mb-1.5 block">
                                What did you complete?
                            </label>
                            <input
                                type="text"
                                value={whatAccomplished}
                                onChange={(e) => setWhatAccomplished(e.target.value)}
                                placeholder="e.g. Solved 2 Sliding Window problems with clean tests"
                                className="w-full px-4 py-3 bg-white border border-cream-dark/80 rounded-2xl text-charcoal placeholder-charcoal/30 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none shadow-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 ml-1 mb-1.5 block">
                                Perceived Difficulty
                            </label>
                            <div className="flex justify-between gap-2">
                                {[1, 2, 3, 4, 5].map((lvl) => (
                                    <button
                                        key={lvl}
                                        type="button"
                                        onClick={() => setDifficultyRating(lvl)}
                                        className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                            difficultyRating === lvl
                                                ? "bg-charcoal text-white border-charcoal shadow-sm"
                                                : "bg-white border-cream-dark/80 text-charcoal/60 hover:bg-cream/40"
                                        }`}
                                    >
                                        {lvl}
                                    </button>
                                ))}
                            </div>
                            <div className="flex justify-between text-[10px] text-charcoal/40 px-1 mt-1 font-medium">
                                <span>1 (Breeze)</span>
                                <span>3 (Solid)</span>
                                <span>5 (Exhausting)</span>
                            </div>
                        </div>

                        <div>
                            <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 ml-1 mb-1.5 block">
                                Did this move you closer to your goal?
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setMovedCloserToGoal(true)}
                                    className={`py-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                        movedCloserToGoal
                                            ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                                            : "bg-white border-cream-dark/80 text-charcoal/60 hover:bg-cream/40"
                                    }`}
                                >
                                    <FaFire size={12} />
                                    <span>Absolutely</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMovedCloserToGoal(false)}
                                    className={`py-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                        !movedCloserToGoal
                                            ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                                            : "bg-white border-cream-dark/80 text-charcoal/60 hover:bg-cream/40"
                                    }`}
                                >
                                    <FaBolt size={12} />
                                    <span>Maintenance</span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 ml-1 mb-1.5 block">
                                Quick Reflection / Insight (Optional)
                            </label>
                            <input
                                type="text"
                                value={reflectionNote}
                                onChange={(e) => setReflectionNote(e.target.value)}
                                placeholder="e.g. Next time, start 15 min earlier to avoid fatigue."
                                className="w-full px-4 py-2.5 bg-white border border-cream-dark/80 rounded-2xl text-charcoal placeholder-charcoal/30 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none shadow-sm"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 border border-cream-dark hover:bg-cream text-charcoal/60 text-xs font-semibold rounded-full transition cursor-pointer"
                            >
                                Skip
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 py-3 bg-charcoal hover:bg-black text-white text-xs font-bold rounded-full shadow-md transition cursor-pointer disabled:opacity-50"
                            >
                                {submitting ? "Logging..." : "Confirm & Save Proof"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ReflectionModal;
