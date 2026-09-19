"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/api/axios";
import { toast } from "react-hot-toast";
import { FaShieldAlt, FaArrowRight, FaTimes } from "react-icons/fa";

const RescueModal = ({ onClose, onRescueActivated }) => {
    const [rescueData, setRescueData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activating, setActivating] = useState(false);

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                const res = await axiosInstance.get("/rescue/plan");
                setRescueData(res.data.rescuePlan);
            } catch (error) {
                console.error("Rescue Plan fetch error:", error);
                toast.error("Failed to load rescue plan");
            } finally {
                setLoading(false);
            }
        };
        fetchPlan();
    }, []);

    const handleActivate = async () => {
        if (!rescueData?.recoverySteps) return;
        setActivating(true);
        try {
            await axiosInstance.post("/rescue/activate", {
                recoverySteps: rescueData.recoverySteps
            });
            toast.success("Bextro Recovery Activated! Let's save today in silence.");
            if (onRescueActivated) onRescueActivated();
            onClose();
        } catch (error) {
            console.error("Activate rescue error:", error);
            toast.error("Failed to activate recovery plan");
        } finally {
            setActivating(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-dark-green/90 backdrop-blur-md z-[95] flex items-center justify-center p-4 font-sans-clean"
            >
                <motion.div
                    initial={{ scale: 0.95, y: 15 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 15 }}
                    className="bg-cream-card border border-cream-dark/80 rounded-[2.8rem] max-w-xl w-full p-8 sm:p-10 shadow-2xl text-charcoal relative overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3.5 py-1.5 rounded-full border border-rose-200 inline-flex items-center gap-1.5">
                                <FaShieldAlt size={12} className="text-rose-600" />
                                <span>Bextro Rescue Mode</span>
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-charcoal/40 hover:text-charcoal text-sm p-1 cursor-pointer"
                        >
                            <FaTimes size={14} />
                        </button>
                    </div>

                    {loading ? (
                        <div className="py-16 text-center space-y-3">
                            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="text-xs text-charcoal/60 font-medium">
                                Calculating remaining bandwidth & triaging high-leverage moves...
                            </p>
                        </div>
                    ) : rescueData ? (
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-serif-elegant font-normal text-charcoal leading-snug">
                                    {rescueData.rescueHeadline}
                                </h1>
                                <p className="text-xs text-charcoal/60 mt-1 italic font-serif-elegant">
                                    "{rescueData.philosophy}"
                                </p>
                            </div>

                            {/* Recovery Steps List */}
                            <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                                {rescueData.recoverySteps?.map((step, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                                            step.type === "focus"
                                                ? "bg-white border-cream-dark/80 shadow-sm"
                                                : step.type === "break"
                                                ? "bg-emerald-50/50 border-emerald-200 text-emerald-900"
                                                : "bg-indigo-50/50 border-indigo-200 text-indigo-900"
                                        }`}
                                    >
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-mono font-bold text-charcoal/40">
                                                    {step.timeLabel}
                                                </span>
                                                <span className="text-xs font-bold text-charcoal">
                                                    {step.actionTitle}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-charcoal/50">{step.reason}</p>
                                        </div>
                                        <span className="text-[11px] font-bold px-2.5 py-1 bg-cream rounded-full border border-cream-dark/50 whitespace-nowrap ml-2">
                                            {step.durationMinutes}m
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Activate CTA */}
                            <div className="pt-2 flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-3.5 border border-cream-dark hover:bg-cream text-charcoal/70 text-xs font-semibold rounded-full transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleActivate}
                                    disabled={activating}
                                    className="flex-2 py-3.5 bg-charcoal hover:bg-black text-white text-xs font-bold rounded-full shadow-lg hover:scale-[1.02] active:scale-95 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <span>{activating ? "Activating..." : "Start Recovery Mode"}</span>
                                    {!activating && <FaArrowRight size={12} />}
                                </button>
                            </div>
                        </div>
                    ) : null}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default RescueModal;
