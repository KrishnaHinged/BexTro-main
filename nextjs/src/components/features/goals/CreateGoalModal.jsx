"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/api/axios";
import { toast } from "react-hot-toast";
import { FaBullseye, FaLightbulb, FaBolt, FaArrowRight, FaTimes } from "react-icons/fa";

const CATEGORIES = ["Career", "Education", "Fitness", "Finance", "Personal", "Creativity", "Relationships", "Skills"];

const CreateGoalModal = ({ onClose, onGoalCreated }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [goalInput, setGoalInput] = useState({
        title: "",
        motivation: "",
        category: "Career",
        deadline: "",
        targetState: ""
    });

    const [aiPlan, setAiPlan] = useState(null);

    const handleGenerateBreakdown = async (e) => {
        e.preventDefault();
        if (!goalInput.title.trim()) {
            toast.error("Please enter a goal title!");
            return;
        }

        setLoading(true);
        try {
            const res = await axiosInstance.post("/goals/ai-plan", goalInput);
            const planData = res.data.plan || res.data.aiPlan;
            setAiPlan(planData);
            setStep(2);
        } catch (error) {
            console.error("AI Goal Plan error:", error);
            toast.error("Failed to generate AI plan");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmAndSave = async () => {
        if (!aiPlan) return;
        setLoading(true);
        try {
            const res = await axiosInstance.post("/goals", {
                title: goalInput.title,
                description: goalInput.motivation || "",
                category: aiPlan.category || goalInput.category,
                motivation: goalInput.motivation || "",
                deadline: goalInput.deadline ? new Date(goalInput.deadline) : null,
                startingState: aiPlan.startingState,
                targetState: aiPlan.targetState,
                measurableMetrics: aiPlan.measurableMetrics,
                milestones: aiPlan.milestones,
                weeklyTargets: aiPlan.weeklyTargets,
                starterDailyTasks: aiPlan.starterDailyTasks,
                aiInsight: aiPlan.aiInsight,
                isPrimary: true
            });

            toast.success("Goal and trajectory saved!");
            if (onGoalCreated) onGoalCreated(res.data.goal);
            onClose();
        } catch (error) {
            console.error("Save goal error:", error);
            toast.error("Failed to save goal");
        } finally {
            setLoading(false);
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
                    className="bg-cream-card border border-cream-dark/80 rounded-[2.8rem] max-w-2xl w-full p-8 sm:p-10 shadow-2xl text-charcoal relative overflow-hidden max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100 inline-flex items-center gap-1.5">
                                <FaBullseye size={12} className="text-indigo-600" />
                                <span>Goal Engine 2.0</span>
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-charcoal/40 hover:text-charcoal text-sm p-1 cursor-pointer"
                        >
                            <FaTimes size={14} />
                        </button>
                    </div>

                    {step === 1 ? (
                        <form onSubmit={handleGenerateBreakdown} className="space-y-5">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-serif-elegant font-normal text-charcoal mb-1">
                                    Set Meaningful Long-Term Goal
                                </h1>
                                <p className="text-xs text-charcoal/60">
                                    AI will convert this intent into milestones, weekly targets, and daily moves.
                                </p>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 ml-1 mb-1.5 block">
                                    Goal Statement
                                </label>
                                <input
                                    type="text"
                                    value={goalInput.title}
                                    onChange={(e) => setGoalInput({ ...goalInput, title: e.target.value })}
                                    placeholder="e.g. Master Full-Stack Development and land a ₹12 LPA Job"
                                    className="w-full px-4 py-3.5 bg-white border border-cream-dark/80 rounded-2xl text-charcoal text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none shadow-sm"
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div>
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 ml-1 mb-1.5 block">
                                        Category
                                    </label>
                                    <select
                                        value={goalInput.category}
                                        onChange={(e) => setGoalInput({ ...goalInput, category: e.target.value })}
                                        className="w-full px-4 py-3 bg-white border border-cream-dark/80 rounded-2xl text-charcoal text-xs font-semibold focus:border-indigo-500 outline-none shadow-sm cursor-pointer"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 ml-1 mb-1.5 block">
                                        Target Deadline (Optional)
                                    </label>
                                    <input
                                        type="date"
                                        value={goalInput.deadline}
                                        onChange={(e) => setGoalInput({ ...goalInput, deadline: e.target.value })}
                                        className="w-full px-4 py-3 bg-white border border-cream-dark/80 rounded-2xl text-charcoal text-xs font-semibold focus:border-indigo-500 outline-none shadow-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 ml-1 mb-1.5 block">
                                    Why this matters to you (Motivation)
                                </label>
                                <textarea
                                    value={goalInput.motivation}
                                    onChange={(e) => setGoalInput({ ...goalInput, motivation: e.target.value })}
                                    placeholder="e.g. Independence, building world-class products, financial freedom."
                                    rows={2}
                                    className="w-full px-4 py-3 bg-white border border-cream-dark/80 rounded-2xl text-charcoal text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none shadow-sm resize-none"
                                />
                            </div>

                            <div className="pt-2 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-3 border border-cream-dark hover:bg-cream text-charcoal/70 text-xs font-semibold rounded-full transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-charcoal hover:bg-black text-white text-xs font-bold rounded-full shadow-lg hover:scale-[1.02] active:scale-95 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                                >
                                    <span>{loading ? "Analyzing Intent..." : "Generate AI Trajectory"}</span>
                                    {!loading && <FaArrowRight size={12} />}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-serif-elegant font-normal text-charcoal">
                                    Structured Trajectory Breakdown
                                </h2>
                                <p className="text-xs text-charcoal/60 mt-0.5">
                                    AI generated prioritized milestones, measurable deliverables, and starter moves.
                                </p>
                            </div>

                            {/* AI Strategic Insight */}
                            {aiPlan?.aiInsight && (
                                <div className="p-4 bg-indigo-50/70 border border-indigo-200/80 rounded-2xl text-xs text-indigo-950 flex items-start gap-2.5">
                                    <FaLightbulb size={16} className="text-indigo-600 mt-0.5 shrink-0" />
                                    <p className="leading-relaxed font-medium">{aiPlan.aiInsight}</p>
                                </div>
                            )}

                            {/* Milestones Road */}
                            <div className="space-y-2.5">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 block ml-1">
                                    Prioritized Milestones Roadmap
                                </span>
                                <div className="space-y-2">
                                    {aiPlan?.milestones?.map((m, idx) => (
                                        <div
                                            key={idx}
                                            className="p-3.5 bg-white border border-cream-dark/80 rounded-2xl flex items-center justify-between shadow-sm"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="w-6 h-6 rounded-full bg-cream text-charcoal font-bold text-xs flex items-center justify-center border border-cream-dark/80">
                                                    {idx + 1}
                                                </span>
                                                <div>
                                                    <h4 className="text-xs font-bold text-charcoal">{m.title || `Phase ${idx + 1}`}</h4>
                                                    <p className="text-[11px] text-charcoal/50">{m.keyDeliverable || m.deliverable || "Core milestone deliverable"}</p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                                ~{m.estimatedWeeks || m.targetWeeks || 2} wks
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Immediate Starter Actions */}
                            {aiPlan?.starterDailyTasks?.length > 0 && (
                                <div className="p-4 bg-cream/80 border border-cream-dark/80 rounded-2xl space-y-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50 block">
                                        Immediate Starter Move Queued
                                    </span>
                                    <div className="flex items-center justify-between text-xs font-bold text-charcoal">
                                        <span className="inline-flex items-center gap-1.5">
                                            <FaBolt size={11} className="text-amber-500" />
                                            <span>
                                                {typeof aiPlan.starterDailyTasks[0] === "string"
                                                    ? aiPlan.starterDailyTasks[0]
                                                    : (aiPlan.starterDailyTasks[0]?.title || "First actionable step")}
                                            </span>
                                        </span>
                                        <span className="text-charcoal/50">
                                            {typeof aiPlan.starterDailyTasks[0] === "object"
                                                ? (aiPlan.starterDailyTasks[0]?.timeBlockMinutes || 25)
                                                : 25} mins
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="pt-2 flex justify-between gap-3">
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-6 py-3 border border-cream-dark hover:bg-cream text-charcoal/70 text-xs font-semibold rounded-full transition cursor-pointer"
                                >
                                    Back / Edit
                                </button>
                                <button
                                    onClick={handleConfirmAndSave}
                                    disabled={loading}
                                    className="px-8 py-3 bg-charcoal hover:bg-black text-white text-xs font-bold rounded-full shadow-lg hover:scale-[1.02] active:scale-95 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                                >
                                    <span>{loading ? "Saving Trajectory..." : "Activate Goal & Trajectory"}</span>
                                    {!loading && <FaArrowRight size={12} />}
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CreateGoalModal;
