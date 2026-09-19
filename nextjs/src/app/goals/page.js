"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import axiosInstance from "@/api/axios";
import { toast } from "react-hot-toast";
import { 
    FaBullseye, 
    FaPlus, 
    FaFlagCheckered, 
    FaBolt, 
    FaChartLine, 
    FaCalendarAlt, 
    FaArrowRight, 
    FaTrashAlt, 
    FaPauseCircle, 
    FaPlayCircle
} from "react-icons/fa";
import MainSlideBar from "@/components/layout/MainSlideBar";
import PageLoader from "@/components/common/loaders/pagesLoader";
import CreateGoalModal from "@/components/features/goals/CreateGoalModal";

const CATEGORY_COLORS = {
    Career: "bg-indigo-50 text-indigo-700 border-indigo-200",
    Fitness: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Finance: "bg-amber-50 text-amber-700 border-amber-200",
    Education: "bg-cyan-50 text-cyan-700 border-cyan-200",
    Personal: "bg-violet-50 text-violet-700 border-violet-200",
    Creativity: "bg-rose-50 text-rose-700 border-rose-200",
    Skills: "bg-teal-50 text-teal-700 border-teal-200",
    Relationships: "bg-pink-50 text-pink-700 border-pink-200"
};

const MOMENTUM_STYLES = {
    Accelerating: {
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dot: "bg-emerald-500",
        label: "Accelerating 🔥"
    },
    Strong: {
        badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
        dot: "bg-indigo-500",
        label: "Strong Pace ⚡"
    },
    Steady: {
        badge: "bg-amber-50 text-amber-700 border-amber-200",
        dot: "bg-amber-500",
        label: "Steady 🎯"
    },
    "At Risk": {
        badge: "bg-rose-50 text-rose-700 border-rose-200",
        dot: "bg-rose-500",
        label: "Needs Attention ⚠️"
    }
};

export default function GoalsPage() {
    const router = useRouter();
    const [goals, setGoals] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState("active");
    const [deletingId, setDeletingId] = useState(null);

    const fetchGoals = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/goals?status=${filterStatus}`);
            setGoals(res.data.goals || []);
            if (res.data.stats) {
                setStats(res.data.stats);
            }
        } catch (error) {
            console.error("Fetch goals error:", error);
            toast.error("Failed to load goal trajectories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, [filterStatus]);

    const handleToggleStatus = async (e, goal) => {
        e.stopPropagation();
        const newStatus = goal.status === "paused" ? "active" : "paused";
        try {
            await axiosInstance.put(`/goals/${goal._id}`, { status: newStatus });
            toast.success(newStatus === "paused" ? "Trajectory paused" : "Trajectory reactivated!");
            fetchGoals();
        } catch (err) {
            console.error("Toggle status error:", err);
            toast.error("Failed to update status");
        }
    };

    const handleDeleteGoal = async (e, goalId) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this trajectory and its daily actions?")) return;
        try {
            setDeletingId(goalId);
            await axiosInstance.delete(`/goals/${goalId}`);
            toast.success("Goal trajectory removed");
            setGoals(prev => prev.filter(g => g._id !== goalId));
            fetchGoals();
        } catch (err) {
            console.error("Delete goal error:", err);
            toast.error("Failed to delete goal");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="flex min-h-screen bg-cream text-charcoal font-sans-clean">
            <MainSlideBar />

            <div className="flex-1 p-6 md:p-10 overflow-y-auto max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-100 flex items-center gap-1.5">
                                <FaBolt size={11} className="text-indigo-600" />
                                <span>Trajectory Engine 2.0</span>
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-serif-elegant font-normal text-charcoal tracking-tight">
                            Goal Portfolio<span className="text-indigo-600">.</span>
                        </h1>
                        <p className="text-charcoal/60 text-xs md:text-sm mt-1">
                            High-leverage trajectories engineered into milestones, weekly targets, and daily executions.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-6 py-3.5 bg-charcoal hover:bg-black text-white text-xs font-bold rounded-full shadow-lg hover:scale-[1.02] active:scale-95 transition flex items-center gap-2 cursor-pointer w-fit"
                    >
                        <FaPlus size={11} />
                        <span>New Goal Trajectory</span>
                    </button>
                </div>

                {/* Portfolio Analytics Summary Ribbon */}
                {stats && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                        <div className="p-5 bg-cream-card border border-cream-dark/80 rounded-3xl shadow-xs space-y-1">
                            <div className="flex items-center gap-2 text-charcoal/40 text-[11px] font-bold uppercase tracking-wider">
                                <FaBullseye size={12} className="text-indigo-600" />
                                <span>Active Goals</span>
                            </div>
                            <p className="text-2xl sm:text-3xl font-serif-elegant font-bold text-charcoal">
                                {stats.activeGoals}
                                <span className="text-xs font-normal text-charcoal/40 ml-1.5">/ {stats.totalGoals} total</span>
                            </p>
                        </div>

                        <div className="p-5 bg-cream-card border border-cream-dark/80 rounded-3xl shadow-xs space-y-1">
                            <div className="flex items-center gap-2 text-charcoal/40 text-[11px] font-bold uppercase tracking-wider">
                                <FaFlagCheckered size={12} className="text-emerald-600" />
                                <span>Milestones Won</span>
                            </div>
                            <p className="text-2xl sm:text-3xl font-serif-elegant font-bold text-emerald-800">
                                {stats.milestonesAchieved}
                                <span className="text-xs font-normal text-charcoal/40 ml-1.5">/ {stats.totalMilestones} proofed</span>
                            </p>
                        </div>

                        <div className="p-5 bg-cream-card border border-cream-dark/80 rounded-3xl shadow-xs space-y-1">
                            <div className="flex items-center gap-2 text-charcoal/40 text-[11px] font-bold uppercase tracking-wider">
                                <FaChartLine size={12} className="text-indigo-600" />
                                <span>Portfolio Pace</span>
                            </div>
                            <p className="text-2xl sm:text-3xl font-serif-elegant font-bold text-indigo-900">
                                {stats.avgVelocity}%
                                <span className="text-xs font-normal text-charcoal/40 ml-1.5">velocity</span>
                            </p>
                        </div>

                        <div className="p-5 bg-cream-card border border-cream-dark/80 rounded-3xl shadow-xs space-y-1">
                            <div className="flex items-center gap-2 text-charcoal/40 text-[11px] font-bold uppercase tracking-wider">
                                <FaBolt size={12} className="text-amber-500" />
                                <span>Completed</span>
                            </div>
                            <p className="text-2xl sm:text-3xl font-serif-elegant font-bold text-charcoal">
                                {stats.completedGoals}
                                <span className="text-xs font-normal text-charcoal/40 ml-1.5">mastered</span>
                            </p>
                        </div>
                    </div>
                )}

                {/* Filter Tabs */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex gap-2">
                        {[
                            { id: "active", label: "Active Trajectories" },
                            { id: "completed", label: "Completed" },
                            { id: "paused", label: "Paused" },
                            { id: "all", label: "All Portfolio" }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setFilterStatus(tab.id)}
                                className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${
                                    filterStatus === tab.id
                                        ? "bg-charcoal text-white border-charcoal shadow-sm"
                                        : "bg-white border-cream-dark/80 text-charcoal/60 hover:bg-cream/40"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <span className="text-xs font-medium text-charcoal/50">
                        Showing <strong>{goals.length}</strong> {filterStatus} trajectories
                    </span>
                </div>

                {/* Goals Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <PageLoader message="Loading goal trajectories..." />
                    </div>
                ) : goals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {goals.map((goal) => {
                            const momentum = MOMENTUM_STYLES[goal.momentum] || MOMENTUM_STYLES.Steady;
                            const categoryStyle = CATEGORY_COLORS[goal.category] || "bg-indigo-50 text-indigo-700 border-indigo-200";

                            const completedMilestones = goal.milestones?.filter(m => m.completed || m.status === "completed")?.length || 0;
                            const totalMilestones = goal.milestones?.length || 0;

                            return (
                                <motion.div
                                    key={goal._id}
                                    whileHover={{ y: -3 }}
                                    onClick={() => router.push(`/goals/${goal._id}`)}
                                    className="p-7 bg-cream-card border border-cream-dark/80 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all cursor-pointer space-y-6 flex flex-col justify-between group"
                                >
                                    <div className="space-y-4">
                                        {/* Top Tags & Action Menu */}
                                        <div className="flex justify-between items-center gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border shadow-2xs ${categoryStyle}`}>
                                                    {goal.category}
                                                </span>
                                                <span className={`text-[10px] font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${momentum.badge}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${momentum.dot} animate-pulse`}></span>
                                                    <span>{momentum.label}</span>
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition" onClick={e => e.stopPropagation()}>
                                                <button
                                                    onClick={(e) => handleToggleStatus(e, goal)}
                                                    title={goal.status === "paused" ? "Resume trajectory" : "Pause trajectory"}
                                                    className="p-2 text-charcoal/40 hover:text-charcoal hover:bg-white rounded-full transition cursor-pointer"
                                                >
                                                    {goal.status === "paused" ? (
                                                        <FaPlayCircle size={15} className="text-emerald-600" />
                                                    ) : (
                                                        <FaPauseCircle size={15} />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={(e) => handleDeleteGoal(e, goal._id)}
                                                    disabled={deletingId === goal._id}
                                                    title="Delete trajectory"
                                                    className="p-2 text-charcoal/30 hover:text-rose-600 hover:bg-rose-50 rounded-full transition cursor-pointer disabled:opacity-40"
                                                >
                                                    <FaTrashAlt size={13} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Title & Target Outcome */}
                                        <div>
                                            <h3 className="text-xl font-serif-elegant font-normal text-charcoal leading-snug group-hover:text-indigo-900 transition">
                                                {goal.title}
                                            </h3>

                                            {goal.targetState && (
                                                <p className="text-xs text-charcoal/60 mt-1.5 line-clamp-2 leading-relaxed">
                                                    <strong>Outcome:</strong> {goal.targetState}
                                                </p>
                                            )}

                                            {goal.motivation && (
                                                <p className="text-[11px] text-charcoal/45 italic mt-1 line-clamp-1">
                                                    "{goal.motivation}"
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Trajectory Progress Bar & Metrics */}
                                    <div className="space-y-3.5 pt-3 border-t border-cream-dark/50">
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-xs font-bold text-charcoal/70">
                                                <span>Milestone Velocity</span>
                                                <span className="font-mono text-indigo-600">{goal.progress || 0}%</span>
                                            </div>
                                            <div className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-cream-dark/80">
                                                <div
                                                    className="h-full bg-gradient-to-r from-charcoal to-indigo-600 rounded-full transition-all duration-700"
                                                    style={{ width: `${Math.max(5, goal.progress || 0)}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center text-[11px] text-charcoal/50">
                                            <span className="flex items-center gap-1.5">
                                                <FaFlagCheckered size={10} className="text-charcoal/40" />
                                                <span>Milestones: <strong className="text-charcoal">{completedMilestones}/{totalMilestones}</strong></span>
                                            </span>

                                            {goal.deadline ? (
                                                <span className="flex items-center gap-1">
                                                    <FaCalendarAlt size={10} className="text-charcoal/40" />
                                                    <span>Target: <strong>{new Date(goal.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</strong></span>
                                                </span>
                                            ) : (
                                                <span>Consistency: <strong className="text-charcoal">{goal.consistency || 100}%</strong></span>
                                            )}
                                        </div>

                                        <div className="pt-1 flex justify-end">
                                            <span className="text-xs font-bold text-indigo-600 group-hover:text-indigo-800 transition flex items-center gap-1.5">
                                                <span>Enter Trajectory</span>
                                                <FaArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-12 sm:p-16 bg-cream-card border border-cream-dark/80 rounded-[2.8rem] text-center space-y-4 max-w-lg mx-auto shadow-xs">
                        <div className="w-16 h-16 rounded-full bg-white border border-cream-dark flex items-center justify-center mx-auto shadow-sm text-charcoal/30">
                            <FaBullseye size={30} />
                        </div>
                        <h3 className="text-2xl font-serif-elegant font-normal text-charcoal">
                            No {filterStatus === "all" ? "" : filterStatus} goals found
                        </h3>
                        <p className="text-xs text-charcoal/60 leading-relaxed max-w-sm mx-auto">
                            Transform an ambitious aspiration into actionable phases, proofed deliverables, and daily time blocks.
                        </p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-8 py-3.5 bg-charcoal hover:bg-black text-white text-xs font-bold rounded-full shadow-md transition cursor-pointer flex items-center gap-2 mx-auto"
                        >
                            <FaPlus size={10} />
                            <span>Design First Trajectory</span>
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
