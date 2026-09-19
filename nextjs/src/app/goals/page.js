"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import axiosInstance from "@/api/axios";
import { FaBullseye } from "react-icons/fa";
import MainSlideBar from "@/components/layout/MainSlideBar";
import PageLoader from "@/components/common/loaders/pagesLoader";
import CreateGoalModal from "@/components/features/goals/CreateGoalModal";

export default function GoalsPage() {
    const router = useRouter();
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState("active");

    const fetchGoals = async () => {
        try {
            const res = await axiosInstance.get(`/goals?status=${filterStatus}`);
            setGoals(res.data.goals || []);
        } catch (error) {
            console.error("Fetch goals error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, [filterStatus]);

    return (
        <div className="flex min-h-screen bg-cream text-charcoal font-sans-clean">
            <MainSlideBar />

            <div className="flex-1 p-6 md:p-10 overflow-y-auto max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                                Trajectory Engine
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-serif-elegant font-normal text-charcoal">
                            Goal Portfolio<span className="text-indigo-600">.</span>
                        </h1>
                        <p className="text-charcoal/60 text-xs md:text-sm mt-1">
                            Meaningful long-term trajectories structured into daily execution.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-6 py-3.5 bg-charcoal hover:bg-black text-white text-xs font-bold rounded-full shadow-lg hover:scale-[1.02] active:scale-95 transition flex items-center gap-2 cursor-pointer w-fit"
                    >
                        <span>+</span>
                        <span>New Goal Trajectory</span>
                    </button>
                </div>

                {/* Status Filter Tabs */}
                <div className="flex gap-2">
                    {["active", "completed", "paused"].map((st) => (
                        <button
                            key={st}
                            onClick={() => setFilterStatus(st)}
                            className={`px-5 py-2.5 rounded-2xl text-xs font-bold capitalize transition-all border cursor-pointer ${
                                filterStatus === st
                                    ? "bg-charcoal text-white border-charcoal shadow-sm"
                                    : "bg-white border-cream-dark/80 text-charcoal/60 hover:bg-cream/40"
                            }`}
                        >
                            {st}
                        </button>
                    ))}
                </div>

                {/* Goals Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <PageLoader message="Loading goal trajectories..." />
                    </div>
                ) : goals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {goals.map((goal) => {
                            const momentumBadgeColors = {
                                "Accelerating": "bg-emerald-50 text-emerald-700 border-emerald-200",
                                "Strong": "bg-indigo-50 text-indigo-700 border-indigo-200",
                                "Steady": "bg-amber-50 text-amber-700 border-amber-200",
                                "At Risk": "bg-rose-50 text-rose-700 border-rose-200"
                            };

                            return (
                                <motion.div
                                    key={goal._id}
                                    whileHover={{ y: -3 }}
                                    onClick={() => router.push(`/goals/${goal._id}`)}
                                    className="p-7 bg-cream-card border border-cream-dark/80 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all cursor-pointer space-y-5 flex flex-col justify-between"
                                >
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-start">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-white px-3 py-1 rounded-full border border-cream-dark/80 shadow-xs">
                                                {goal.category}
                                            </span>
                                            <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${momentumBadgeColors[goal.momentum] || "bg-cream text-charcoal/70 border-cream-dark"}`}>
                                                {goal.momentum || "Steady"}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-serif-elegant font-normal text-charcoal leading-snug">
                                            {goal.title}
                                        </h3>

                                        {goal.targetState && (
                                            <p className="text-xs text-charcoal/60 line-clamp-2">
                                                Target: {goal.targetState}
                                            </p>
                                        )}
                                    </div>

                                    {/* Progress & Milestones Summary */}
                                    <div className="space-y-3 pt-2">
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-xs font-bold text-charcoal/70">
                                                <span>Trajectory Progress</span>
                                                <span>{goal.progress || 0}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-cream-dark/60">
                                                <div
                                                    className="h-full bg-charcoal rounded-full transition-all duration-500"
                                                    style={{ width: `${goal.progress || 5}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center text-[11px] text-charcoal/50 border-t border-cream-dark/40 pt-3">
                                            <span>Milestones: <strong className="text-charcoal">{goal.milestones?.filter(m => m.status === "completed").length || 0}/{goal.milestones?.length || 0}</strong></span>
                                            <span>Consistency: <strong className="text-charcoal">{goal.consistency || 100}%</strong></span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-12 bg-cream-card border border-cream-dark/80 rounded-[2.5rem] text-center space-y-4 max-w-lg mx-auto">
                        <FaBullseye size={36} className="mx-auto text-charcoal/30" />
                        <h3 className="text-xl font-serif-elegant font-normal text-charcoal">
                            No {filterStatus} goals yet
                        </h3>
                        <p className="text-xs text-charcoal/60">
                            Create your first long-term trajectory. Bextro will break it into milestones and daily actions.
                        </p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-8 py-3 bg-charcoal hover:bg-black text-white text-xs font-bold rounded-full shadow-md transition cursor-pointer"
                        >
                            Create First Goal
                        </button>
                    </div>
                )}
            </div>

            {showCreateModal && (
                <CreateGoalModal
                    onClose={() => setShowCreateModal(false)}
                    onGoalCreated={fetchGoals}
                />
            )}
        </div>
    );
}
