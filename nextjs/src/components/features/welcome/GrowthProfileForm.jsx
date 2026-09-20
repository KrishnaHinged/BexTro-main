"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/api/axios";
import { toast } from "react-hot-toast";
import {
    FaBriefcase,
    FaGraduationCap,
    FaBolt,
    FaDollarSign,
    FaTools,
    FaPalette,
    FaBrain,
    FaHandshake,
    FaArrowRight,
} from "react-icons/fa";

const FOCUS_AREAS = [
    { id: "Career", label: "Career & Tech", icon: <FaBriefcase size={14} className="text-indigo-500" /> },
    { id: "Education", label: "Academics / Exams", icon: <FaGraduationCap size={14} className="text-blue-500" /> },
    { id: "Fitness", label: "Fitness & Health", icon: <FaBolt size={14} className="text-amber-500" /> },
    { id: "Finance", label: "Finance & Wealth", icon: <FaDollarSign size={14} className="text-emerald-500" /> },
    { id: "Skills", label: "High-Income Skills", icon: <FaTools size={14} className="text-purple-500" /> },
    { id: "Creativity", label: "Creative Projects", icon: <FaPalette size={14} className="text-pink-500" /> },
    { id: "Personal", label: "Mindset & Discipline", icon: <FaBrain size={14} className="text-rose-500" /> },
    { id: "Relationships", label: "Relationships", icon: <FaHandshake size={14} className="text-teal-500" /> }
];

const PEAK_PERIODS = [
    { id: "Morning", label: "Morning (6 AM - 12 PM)", desc: "Fresh focus & clarity" },
    { id: "Afternoon", label: "Afternoon (12 PM - 5 PM)", desc: "Steady momentum" },
    { id: "Evening", label: "Evening (5 PM - 9 PM)", desc: "Deep flow state" },
    { id: "Night", label: "Night (9 PM - 1 AM)", desc: "Late silence" }
];

const STRUGGLES = [
    "Inconsistent execution",
    "Starting strong then abandoning",
    "Mindless phone scrolling & distraction",
    "Overthinking & planning too much",
    "Low energy after daytime commitments"
];

const DISTRACTIONS = [
    "Instagram / Reels / TikTok",
    "YouTube binge loops",
    "Frequent notifications & chatting",
    "Gaming / Entertainment",
    "Multitasking / Context switching"
];

const GrowthProfileForm = ({ onComplete }) => {
    const [subStep, setSubStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        primaryGoalStatement: "",
        motivationReason: "",
        focusAreas: ["Career", "Skills"],
        availableHoursPerDay: 2.5,
        preferredWorkingHours: { start: "09:00", end: "21:00", peakPeriod: "Morning" },
        currentSkillLevel: "Intermediate",
        selfReportedConsistency: "Moderate",
        biggestDistractions: ["Instagram / Reels / TikTok"],
        currentHabits: [],
        biggestStruggle: "Inconsistent execution"
    });

    const toggleFocusArea = (areaId) => {
        setFormData(prev => {
            const exists = prev.focusAreas.includes(areaId);
            const updated = exists 
                ? prev.focusAreas.filter(a => a !== areaId)
                : [...prev.focusAreas, areaId];
            return { ...prev, focusAreas: updated.length ? updated : [areaId] };
        });
    };

    const toggleDistraction = (item) => {
        setFormData(prev => {
            const exists = prev.biggestDistractions.includes(item);
            const updated = exists 
                ? prev.biggestDistractions.filter(d => d !== item)
                : [...prev.biggestDistractions, item];
            return { ...prev, biggestDistractions: updated };
        });
    };

    const handleSaveAndGenerate = async () => {
        if (!formData.primaryGoalStatement.trim()) {
            toast.error("Please enter what you want to achieve!");
            setSubStep(1);
            return;
        }

        setLoading(true);
        try {
            const res = await axiosInstance.post("/growth-profile", formData);
            toast.success("Growth Profile created!");
            onComplete(res.data.profile);
        } catch (error) {
            console.error("Save Growth Profile Error:", error);
            toast.error("Failed to save profile. Proceeding with baseline.");
            onComplete(formData);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 font-sans-clean">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-cream-card border border-cream-dark/80 rounded-[2.5rem] p-8 sm:p-10 shadow-xl relative overflow-hidden"
            >
                {/* Progress Indicators */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-cream-dark/60">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                            Step {subStep} of 4
                        </span>
                        <span className="text-xs text-charcoal/50 font-medium">Growth Architecture</span>
                    </div>
                    <div className="flex gap-1.5">
                        {[1, 2, 3, 4].map(idx => (
                            <div
                                key={idx}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    subStep >= idx ? "w-6 bg-charcoal" : "w-2 bg-cream-dark"
                                }`}
                            />
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {/* SUB-STEP 1: Intent & Core Motivation */}
                    {subStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-serif-elegant font-normal text-charcoal mb-2">
                                    What is the main thing you want to achieve?
                                </h2>
                                <p className="text-charcoal/60 text-sm">
                                    Be as specific as you like. Bextro will translate this into daily high-leverage execution.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 ml-1 mb-1.5 block">
                                        Your Primary Goal Statement
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.primaryGoalStatement}
                                        onChange={(e) => setFormData({ ...formData, primaryGoalStatement: e.target.value })}
                                        placeholder="e.g. Become a full-stack developer & land a ₹12 LPA job"
                                        className="w-full px-5 py-4 bg-white border border-cream-dark/80 rounded-2xl text-charcoal placeholder-charcoal/30 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 ml-1 mb-1.5 block">
                                        Why does this truly matter to you?
                                    </label>
                                    <textarea
                                        value={formData.motivationReason}
                                        onChange={(e) => setFormData({ ...formData, motivationReason: e.target.value })}
                                        placeholder="e.g. Financial independence, building high-value products, and proving to myself what I'm capable of."
                                        rows={3}
                                        className="w-full px-5 py-3.5 bg-white border border-cream-dark/80 rounded-2xl text-charcoal placeholder-charcoal/30 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={() => {
                                        if (!formData.primaryGoalStatement.trim()) {
                                            toast.error("Please enter your goal statement");
                                            return;
                                        }
                                        setSubStep(2);
                                    }}
                                    className="px-8 py-3.5 bg-charcoal hover:bg-black text-white text-sm font-semibold rounded-full shadow-md transition-all flex items-center gap-2 cursor-pointer"
                                >
                                    <span>Continue</span>
                                    <FaArrowRight size={11} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* SUB-STEP 2: Focus Areas & Time Commitment */}
                    {subStep === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-serif-elegant font-normal text-charcoal mb-2">
                                    Focus Areas & Daily Bandwidth
                                </h2>
                                <p className="text-charcoal/60 text-sm">
                                    Select the domains you want Bextro to prioritize and realistically balance.
                                </p>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 ml-1 mb-2.5 block">
                                    Major Areas of Focus (Choose 1-4)
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                    {FOCUS_AREAS.map(({ id, label, icon }) => {
                                        const isSelected = formData.focusAreas.includes(id);
                                        return (
                                            <button
                                                key={id}
                                                type="button"
                                                onClick={() => toggleFocusArea(id)}
                                                className={`p-3 rounded-2xl border text-left transition-all text-xs font-semibold flex items-center gap-2 cursor-pointer ${
                                                    isSelected
                                                        ? "bg-charcoal border-charcoal text-white shadow-md scale-[1.02]"
                                                        : "bg-white border-cream-dark/80 text-charcoal/80 hover:border-charcoal/40"
                                                }`}
                                            >
                                                <span className="text-base">{icon}</span>
                                                <span className="truncate">{label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 ml-1">
                                        Realistic Available Hours Per Day
                                    </label>
                                    <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100">
                                        {formData.availableHoursPerDay} Hours / Day
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="8"
                                    step="0.5"
                                    value={formData.availableHoursPerDay}
                                    onChange={(e) => setFormData({ ...formData, availableHoursPerDay: parseFloat(e.target.value) })}
                                    className="w-full accent-indigo-600 cursor-pointer"
                                />
                                <div className="flex justify-between text-[11px] text-charcoal/40 mt-1 font-medium">
                                    <span>30 mins (Bite-sized)</span>
                                    <span>2.5 hrs (Standard)</span>
                                    <span>6+ hrs (Deep Sprint)</span>
                                </div>
                            </div>

                            <div className="flex justify-between pt-4">
                                <button
                                    onClick={() => setSubStep(1)}
                                    className="px-6 py-3 border border-cream-dark hover:bg-cream text-charcoal/70 text-sm font-semibold rounded-full transition-all cursor-pointer"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => setSubStep(3)}
                                    className="px-8 py-3.5 bg-charcoal hover:bg-black text-white text-sm font-semibold rounded-full shadow-md transition-all flex items-center gap-2 cursor-pointer"
                                >
                                    <span>Next: Rhythm & Struggles</span>
                                    <FaArrowRight size={11} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* SUB-STEP 3: Peak Flow & Struggles */}
                    {subStep === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-serif-elegant font-normal text-charcoal mb-2">
                                    Your Natural Rhythm & Friction Points
                                </h2>
                                <p className="text-charcoal/60 text-sm">
                                    Bextro schedules high-cognitive tasks when you work best, not at arbitrary times.
                                </p>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 ml-1 mb-2 block">
                                    When is your natural peak focus window?
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    {PEAK_PERIODS.map(({ id, label, desc }) => {
                                        const isSelected = formData.preferredWorkingHours.peakPeriod === id;
                                        return (
                                            <button
                                                key={id}
                                                type="button"
                                                onClick={() => setFormData({
                                                    ...formData,
                                                    preferredWorkingHours: { ...formData.preferredWorkingHours, peakPeriod: id }
                                                })}
                                                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                                                    isSelected
                                                        ? "bg-charcoal border-charcoal text-white shadow-md"
                                                        : "bg-white border-cream-dark/80 text-charcoal/80 hover:border-charcoal/40"
                                                }`}
                                            >
                                                <div className="text-xs font-bold">{label}</div>
                                                <div className={`text-[11px] mt-0.5 ${isSelected ? "text-white/70" : "text-charcoal/50"}`}>{desc}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 ml-1 mb-2 block">
                                    What do you struggle with most right now?
                                </label>
                                <div className="space-y-2">
                                    {STRUGGLES.map((struggle) => (
                                        <button
                                            key={struggle}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, biggestStruggle: struggle })}
                                            className={`w-full p-3 rounded-2xl border text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                                                formData.biggestStruggle === struggle
                                                    ? "bg-indigo-50 border-indigo-300 text-indigo-900 shadow-sm"
                                                    : "bg-white border-cream-dark/80 text-charcoal/70 hover:bg-cream/40"
                                            }`}
                                        >
                                            <span>{struggle}</span>
                                            {formData.biggestStruggle === struggle && (
                                                <span className="text-indigo-600 font-bold">✓</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-between pt-4">
                                <button
                                    onClick={() => setSubStep(2)}
                                    className="px-6 py-3 border border-cream-dark hover:bg-cream text-charcoal/70 text-sm font-semibold rounded-full transition-all cursor-pointer"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => setSubStep(4)}
                                    className="px-8 py-3.5 bg-charcoal hover:bg-black text-white text-sm font-semibold rounded-full shadow-md transition-all flex items-center gap-2 cursor-pointer"
                                >
                                    <span>Next: Distractions & Twin</span>
                                    <FaArrowRight size={11} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* SUB-STEP 4: Distractions & Generate Growth Twin */}
                    {subStep === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-serif-elegant font-normal text-charcoal mb-2">
                                    Distractions & Baseline Alignment
                                </h2>
                                <p className="text-charcoal/60 text-sm">
                                    Bextro&apos;s Anti-Doomscroll and Rescue engines will guard your momentum against these patterns.
                                </p>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 ml-1 mb-2 block">
                                    Biggest Time Sinks & Distractions
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    {DISTRACTIONS.map((item) => {
                                        const isSelected = formData.biggestDistractions.includes(item);
                                        return (
                                            <button
                                                key={item}
                                                type="button"
                                                onClick={() => toggleDistraction(item)}
                                                className={`p-3 rounded-2xl border text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                                                    isSelected
                                                        ? "bg-charcoal border-charcoal text-white shadow-sm"
                                                        : "bg-white border-cream-dark/80 text-charcoal/70 hover:bg-cream/40"
                                                }`}
                                            >
                                                <span>{item}</span>
                                                {isSelected && <span className="text-white font-bold">✓</span>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl">
                                <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold mb-1">
                                    <span>The Bextro Promise</span>
                                </div>
                                <p className="text-[12px] text-emerald-950/80 leading-relaxed">
                                    No endless checkboxes. No guilt trips when life happens. Just continuous, calculated next moves in silence.
                                </p>
                            </div>

                            <div className="flex justify-between pt-4">
                                <button
                                    onClick={() => setSubStep(3)}
                                    className="px-6 py-3 border border-cream-dark hover:bg-cream text-charcoal/70 text-sm font-semibold rounded-full transition-all cursor-pointer"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSaveAndGenerate}
                                    disabled={loading}
                                    className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-full shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 cursor-pointer font-bold disabled:opacity-50"
                                >
                                    {loading ? "Generating Growth Profile..." : (
                                        <>
                                            <span>Build Growth Profile</span>
                                            <FaArrowRight size={12} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default GrowthProfileForm;
