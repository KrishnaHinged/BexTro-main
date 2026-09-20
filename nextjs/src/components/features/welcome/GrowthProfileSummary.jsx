"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import axiosInstance from "@/api/axios";
import { toast } from "react-hot-toast";
import { FaCheckCircle, FaArrowRight } from "react-icons/fa";

const GrowthProfileSummary = ({ profile, onProceedToDashboard }) => {
    const router = useRouter();
    const [generatingGoal, setGeneratingGoal] = useState(false);

    const handleCreateInitialGoalAndStart = async () => {
        setGeneratingGoal(true);
        try {
            const goalTitle = profile.primaryGoalStatement || "Primary Growth Trajectory";
            const aiPlanRes = await axiosInstance.post("/goals/ai-plan", {
                title: goalTitle,
                motivation: profile.motivationReason || "Achieve long-term mastery",
                category: profile.focusAreas?.[0] || "Career"
            });

            const plan = aiPlanRes.data.plan;

            await axiosInstance.post("/goals", {
                title: goalTitle,
                description: profile.motivationReason || "",
                category: plan.category || "Career",
                motivation: profile.motivationReason || "",
                startingState: plan.startingState,
                targetState: plan.targetState,
                measurableMetrics: plan.measurableMetrics,
                milestones: plan.milestones,
                weeklyTargets: plan.weeklyTargets,
                starterDailyTasks: plan.starterDailyTasks,
                aiInsight: plan.aiInsight,
                isPrimary: true
            });

            toast.success("Goal trajectory created!");
            if (onProceedToDashboard) {
                onProceedToDashboard();
            } else {
                router.push("/dashboard");
            }
        } catch (error) {
            console.error("Auto goal creation error:", error);
            router.push("/dashboard");
        } finally {
            setGeneratingGoal(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 font-sans-clean">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-cream-card border border-cream-dark/80 rounded-[2.5rem] p-8 sm:p-10 shadow-xl text-center space-y-8"
            >
                <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100 inline-flex items-center gap-1.5">
                        <FaCheckCircle size={12} className="text-indigo-600" />
                        <span>Personal Growth Profile Generated</span>
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-serif-elegant font-normal text-charcoal pt-2">
                        Your Operating System Is Live
                    </h1>
                    <p className="text-charcoal/60 text-sm max-w-lg mx-auto">
                        Bextro has structured your intent into an intelligent trajectory engine.
                    </p>
                </div>

                {/* Profile Overview Card */}
                <div className="p-6 bg-white border border-cream-dark/80 rounded-3xl text-left space-y-4 shadow-sm">
                    <div className="flex justify-between items-start border-b border-cream-dark/40 pb-3">
                        <div>
                            <span className="text-[10px] uppercase font-bold text-charcoal/40 tracking-wider">Primary Intent</span>
                            <h3 className="text-base sm:text-lg font-serif-elegant font-bold text-charcoal mt-0.5">
                                {profile.primaryGoalStatement || "High Performance Trajectory"}
                            </h3>
                        </div>
                        <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                            Trajectory: Active
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                        <div className="p-3 bg-cream/60 rounded-2xl border border-cream-dark/50">
                            <span className="text-[10px] text-charcoal/50 font-bold block uppercase">Focus Window</span>
                            <span className="text-xs font-bold text-charcoal mt-0.5 block">
                                {profile.preferredWorkingHours?.peakPeriod || "Morning"}
                            </span>
                        </div>
                        <div className="p-3 bg-cream/60 rounded-2xl border border-cream-dark/50">
                            <span className="text-[10px] text-charcoal/50 font-bold block uppercase">Daily Target</span>
                            <span className="text-xs font-bold text-charcoal mt-0.5 block">
                                {profile.availableHoursPerDay || 2.5} hrs / day
                            </span>
                        </div>
                        <div className="p-3 bg-cream/60 rounded-2xl border border-cream-dark/50 col-span-2 sm:col-span-1">
                            <span className="text-[10px] text-charcoal/50 font-bold block uppercase">Focus Areas</span>
                            <span className="text-xs font-bold text-charcoal mt-0.5 block truncate">
                                {(profile.focusAreas || ["Career", "Skills"]).join(", ")}
                            </span>
                        </div>
                    </div>

                    {profile.motivationReason && (
                        <div className="text-xs text-charcoal/70 bg-indigo-50/40 p-3 rounded-2xl border border-indigo-100/60 italic font-serif-elegant">
                            &quot;{profile.motivationReason}&quot;
                        </div>
                    )}
                </div>

                {/* Next Step Action */}
                <div className="pt-2">
                    <button
                        onClick={handleCreateInitialGoalAndStart}
                        disabled={generatingGoal}
                        className="w-full sm:w-auto px-10 py-4 bg-charcoal hover:bg-black text-white text-sm font-semibold rounded-full shadow-xl hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                    >
                        {generatingGoal ? (
                            <>
                                <span className="loading loading-spinner loading-xs"></span>
                                <span>Generating Trajectory & Schedule...</span>
                            </>
                        ) : (
                            <>
                                <span>Enter Command Dashboard</span>
                                <FaArrowRight size={12} />
                            </>
                        )}
                    </button>
                    <p className="text-[11px] text-charcoal/40 mt-3 font-medium">
                        Move in silence. Let your progress speak.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default GrowthProfileSummary;
