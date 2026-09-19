"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/api/axios";
import { toast } from "react-hot-toast";
import { FaTrash, FaBullseye, FaCheckCircle, FaUser } from "react-icons/fa";

const GoalManagement = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchGoals = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/admin/goals");
            setGoals(res.data.goals || []);
        } catch (error) {
            console.error("Admin fetch goals error:", error);
            toast.error("Failed to load goals");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const handleDeleteGoal = async (goalId) => {
        if (!window.confirm("Are you sure you want to delete this user goal?")) return;
        try {
            await axiosInstance.delete(`/admin/goals/${goalId}`);
            toast.success("Goal deleted by admin");
            setGoals(prev => prev.filter(g => g._id !== goalId));
        } catch (error) {
            console.error("Admin delete goal error:", error);
            toast.error("Failed to delete goal");
        }
    };

    if (loading) {
        return (
            <div className="py-20 text-center text-charcoal/50">
                <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-xs font-medium">Loading user trajectories...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-serif-elegant font-normal text-charcoal">
                        Goal & Trajectory Management
                    </h2>
                    <p className="text-xs text-charcoal/50 mt-0.5">
                        Global oversight of all active and completed user trajectories ({goals.length} total)
                    </p>
                </div>
            </div>

            {goals.length === 0 ? (
                <p className="text-xs text-charcoal/50 py-10 text-center">No goals created yet across the platform.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {goals.map((goal) => (
                        <div
                            key={goal._id}
                            className="p-5 bg-white border border-cream-dark/80 rounded-2xl shadow-xs space-y-3 flex flex-col justify-between"
                        >
                            <div className="space-y-2">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={goal.user?.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(goal.user?.username || "User")}`}
                                            alt="User"
                                            className="w-6 h-6 rounded-full object-cover border border-cream-dark"
                                            onError={(e) => {
                                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(goal.user?.username || "User")}`;
                                            }}
                                        />
                                        <span className="text-xs font-bold text-charcoal/80">
                                            @{goal.user?.username || "unknown"}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                                        {goal.category}
                                    </span>
                                </div>

                                <h3 className="text-sm font-bold text-charcoal leading-snug">
                                    {goal.title}
                                </h3>

                                <div className="space-y-1">
                                    <div className="flex justify-between text-[11px] font-semibold text-charcoal/60">
                                        <span>Progress ({goal.progress || 0}%)</span>
                                        <span>{goal.milestones?.filter(m => m.status === "completed").length}/{goal.milestones?.length} Milestones</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-cream rounded-full overflow-hidden border border-cream-dark/60">
                                        <div
                                            className="h-full bg-charcoal rounded-full"
                                            style={{ width: `${goal.progress || 5}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2 flex justify-between items-center border-t border-cream-dark/50 text-[11px] text-charcoal/50">
                                <span>Status: <strong className="text-charcoal capitalize">{goal.status}</strong></span>
                                <button
                                    onClick={() => handleDeleteGoal(goal._id)}
                                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer flex items-center gap-1 font-bold text-[11px]"
                                    title="Delete Goal"
                                >
                                    <FaTrash size={11} />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GoalManagement;
