"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/api/axios";
import { toast } from "react-hot-toast";
import { FaHourglassHalf, FaTimes, FaArrowRight, FaBullseye, FaBolt } from "react-icons/fa";

const AntiDoomscrollModal = ({ initialMinutes = 20, onClose, onStartMicroMove }) => {
    const [selectedMinutes, setSelectedMinutes] = useState(initialMinutes);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchRecommendations = async (mins) => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/anti-doomscroll/recommend?minutes=${mins}`);
            setData(res.data.data);
        } catch (error) {
            console.error("Anti doomscroll error:", error);
            toast.error("Failed to fetch micro-moves");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecommendations(selectedMinutes);
    }, [selectedMinutes]);

    const handleLaunch = async (recommendation) => {
        try {
            const res = await axiosInstance.post("/anti-doomscroll/launch", {
                title: recommendation.title,
                durationMinutes: recommendation.durationMinutes,
                category: recommendation.category,
                goalTitle: recommendation.goalTitle
            });
            toast.success("Micro-move initialized!");
            if (onStartMicroMove) {
                onStartMicroMove(res.data.task);
            }
            onClose();
        } catch (error) {
            console.error("Launch micro move error:", error);
            toast.error("Failed to launch task");
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-dark-green/90 backdrop-blur-md z-[95] flex items-center justify-center p-4 font-sans-clean"
            >
                <motion.div
                    initial={{ scale: 0.95, y: 15 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 15 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-cream-card border border-cream-dark/80 rounded-[2.8rem] max-w-lg w-full p-8 sm:p-10 shadow-2xl text-charcoal relative overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100 inline-flex items-center gap-1.5">
                                <FaBolt size={11} className="text-indigo-600" />
                                <span>I Have {selectedMinutes} Minutes</span>
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-charcoal/40 hover:text-charcoal text-sm p-1 cursor-pointer transition"
                        >
                            <FaTimes size={14} />
                        </button>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-serif-elegant font-normal text-charcoal">
                                One High-Leverage Move.
                            </h2>
                            <p className="text-xs text-charcoal/60 mt-1">
                                {data?.subheadline || "Swap empty scrolling for compound momentum on your real goals."}
                            </p>
                        </div>

                        {/* Duration Selector Pills */}
                        <div className="grid grid-cols-6 gap-1.5 bg-cream p-1.5 rounded-2xl border border-cream-dark/80">
                            {[5, 10, 20, 30, 45, 60].map((mins) => (
                                <button
                                    key={mins}
                                    type="button"
                                    onClick={() => setSelectedMinutes(mins)}
                                    className={`py-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                                        selectedMinutes === mins
                                            ? "bg-charcoal text-white shadow-sm scale-[1.02]"
                                            : "text-charcoal/60 hover:text-charcoal hover:bg-white/50"
                                    }`}
                                >
                                    {mins}m
                                </button>
                            ))}
                        </div>

                        {/* Recommendations */}
                        {loading ? (
                            <div className="py-12 text-center space-y-2">
                                <div className="w-7 h-7 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                <p className="text-xs text-charcoal/50">Calculating highest-leverage move for {selectedMinutes}m...</p>
                            </div>
                        ) : (
                            <div className="space-y-3 pt-1">
                                {data?.recommendations?.map((rec, idx) => (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ scale: 1.01 }}
                                        className="p-5 bg-white border border-cream-dark/80 rounded-2xl shadow-sm space-y-3"
                                    >
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="space-y-1 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                                                        {rec.category || "Focus Drill"}
                                                    </span>
                                                    {rec.goalTitle && (
                                                        <span className="text-[10px] font-medium text-charcoal/50 flex items-center gap-1 truncate max-w-[200px]">
                                                            <FaBullseye size={8} />
                                                            <span>{rec.goalTitle}</span>
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="text-sm font-bold text-charcoal leading-snug">
                                                    {rec.title}
                                                </h3>
                                            </div>
                                            <span className="text-xs font-bold text-charcoal/80 bg-cream px-2.5 py-1 rounded-full border border-cream-dark/80 whitespace-nowrap">
                                                {rec.durationMinutes}m
                                            </span>
                                        </div>

                                        <p className="text-[11px] text-charcoal/60 leading-relaxed">
                                            {rec.impact || "Clears a bottleneck & keeps your streak compounding."}
                                        </p>

                                        <button
                                            onClick={() => handleLaunch(rec)}
                                            className="w-full py-2.5 bg-charcoal hover:bg-black text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer flex items-center justify-center gap-1.5"
                                        >
                                            <span>Execute Move ({rec.durationMinutes}m)</span>
                                            <FaArrowRight size={10} />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AntiDoomscrollModal;
