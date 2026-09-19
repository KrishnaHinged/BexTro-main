"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/api/axios";
import { toast } from "react-hot-toast";
import { FaTimes, FaCalendarCheck, FaChartLine, FaExclamationTriangle, FaLightbulb, FaCheckCircle } from "react-icons/fa";

const WeeklyReviewModal = ({ onClose }) => {
    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const res = await axiosInstance.get("/weekly-review");
                setReview(res.data.review);
            } catch (error) {
                console.error("Weekly review fetch error:", error);
                toast.error("Failed to load weekly review");
            } finally {
                setLoading(false);
            }
        };
        fetchReview();
    }, []);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-dark-green/90 backdrop-blur-md z-[110] flex items-center justify-center p-4 font-sans-clean"
            >
                <motion.div
                    initial={{ scale: 0.95, y: 15 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 15 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-cream-card border border-cream-dark/80 rounded-[2.8rem] max-w-2xl w-full p-8 sm:p-10 shadow-2xl text-charcoal relative max-h-[90vh] overflow-y-auto space-y-6"
                >
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100 inline-flex items-center gap-1.5">
                                <FaCalendarCheck size={12} className="text-indigo-600" />
                                <span>Weekly Execution Retrospective</span>
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-charcoal/40 hover:text-charcoal text-sm p-1 cursor-pointer transition"
                        >
                            <FaTimes size={14} />
                        </button>
                    </div>

                    {loading ? (
                        <div className="py-16 text-center space-y-3">
                            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="text-xs font-medium text-charcoal/60">Synthesizing your 7-day execution record...</p>
                        </div>
                    ) : review ? (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-serif-elegant font-normal text-charcoal">
                                    {review.summaryHeadline}
                                </h2>
                                <p className="text-xs text-charcoal/60 mt-1">
                                    An honest look at what you actually did, what moved forward, and what to adapt next.
                                </p>
                            </div>

                            {/* Top Stats Overview */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <div className="p-4 bg-white border border-cream-dark/80 rounded-2xl">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/40 block">Completion Rate</span>
                                    <span className="text-2xl font-serif-elegant text-charcoal font-bold mt-0.5 block">
                                        {review.completionRate}%
                                    </span>
                                </div>
                                <div className="p-4 bg-white border border-cream-dark/80 rounded-2xl">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/40 block">Strongest Domain</span>
                                    <span className="text-sm font-bold text-emerald-700 mt-1 block truncate">
                                        {review.strongestArea}
                                    </span>
                                </div>
                                <div className="p-4 bg-white border border-cream-dark/80 rounded-2xl col-span-2 sm:col-span-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/40 block">Friction Point</span>
                                    <span className="text-sm font-bold text-rose-700 mt-1 block truncate">
                                        {review.weakestArea}
                                    </span>
                                </div>
                            </div>

                            {/* 1. What Moved Forward */}
                            <div className="p-5 bg-white border border-cream-dark/80 rounded-3xl space-y-2.5">
                                <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
                                    <FaCheckCircle size={12} className="text-emerald-600" />
                                    <span>What Moved Forward</span>
                                </div>
                                <ul className="space-y-1.5 text-xs text-charcoal/80">
                                    {review.whatMovedForward?.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <span className="text-emerald-500 font-bold">•</span>
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* 2. Where Did It Stall & Why */}
                            {review.whereStalled?.length > 0 && (
                                <div className="p-5 bg-rose-50/50 border border-rose-200/70 rounded-3xl space-y-2.5">
                                    <div className="flex items-center gap-2 text-rose-900 text-xs font-bold">
                                        <FaExclamationTriangle size={12} className="text-rose-600" />
                                        <span>Where Friction Happened</span>
                                    </div>
                                    <ul className="space-y-1.5 text-xs text-rose-950/80">
                                        {review.whereStalled.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span className="text-rose-500 font-bold">•</span>
                                                <span className="leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* 3. Discovered Behavioral Pattern */}
                            <div className="p-5 bg-indigo-50/70 border border-indigo-200/80 rounded-3xl space-y-2">
                                <div className="flex items-center gap-2 text-indigo-900 text-xs font-bold">
                                    <FaChartLine size={12} className="text-indigo-600" />
                                    <span>Pattern Discovered by Digital Twin</span>
                                </div>
                                <p className="text-xs text-indigo-950 font-medium leading-relaxed">
                                    {review.patternDiscovered}
                                </p>
                            </div>

                            {/* 4. Concrete Next Week's Adaptation */}
                            <div className="p-5 bg-dark-green text-sand rounded-3xl border border-emerald-800/30 space-y-2 shadow-md">
                                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                    <FaLightbulb size={12} />
                                    <span>Next Week's Adaptation Strategy</span>
                                </div>
                                <p className="text-xs text-sand/90 font-medium leading-relaxed">
                                    {review.nextWeekAdaptation}
                                </p>
                            </div>

                            {/* Dismiss Button */}
                            <div className="pt-2">
                                <button
                                    onClick={onClose}
                                    className="w-full py-3.5 bg-charcoal hover:bg-black text-white text-xs font-bold rounded-full shadow-lg transition cursor-pointer"
                                >
                                    Acknowledge & Close
                                </button>
                            </div>
                        </div>
                    ) : null}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default WeeklyReviewModal;
