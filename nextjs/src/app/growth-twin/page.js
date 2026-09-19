"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/api/axios";
import { FaBrain, FaCheckCircle, FaBolt, FaClock, FaChartLine, FaLightbulb } from "react-icons/fa";
import MainSlideBar from "@/components/layout/MainSlideBar";
import PageLoader from "@/components/common/loaders/pagesLoader";

export default function GrowthTwinPage() {
    const [twinData, setTwinData] = useState(null);
    const [reflections, setReflections] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTwinData = async () => {
        try {
            const [profileRes, reflectionsRes] = await Promise.all([
                axiosInstance.get("/growth-profile"),
                axiosInstance.get("/reflections")
            ]);

            setTwinData(profileRes.data);
            setReflections(reflectionsRes.data?.reflections || []);
        } catch (error) {
            console.error("Fetch Growth Twin error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTwinData();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-screen bg-cream text-charcoal font-sans-clean">
                <MainSlideBar />
                <div className="flex-1 flex items-center justify-center">
                    <PageLoader message="Accessing Digital Growth Twin..." />
                </div>
            </div>
        );
    }

    const profile = twinData?.profile;
    const twin = twinData?.twinStats || profile?.digitalGrowthTwin || {};
    const insights = twin?.insights || [
        "Your Digital Twin refines continuously as you log focus sessions.",
        "Sessions kept under 45 minutes achieve the highest completion rate."
    ];

    return (
        <div className="flex min-h-screen bg-cream text-charcoal font-sans-clean">
            <MainSlideBar />

            <div className="flex-1 p-6 md:p-10 overflow-y-auto max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 inline-flex items-center gap-1.5">
                            <FaBrain size={11} className="text-indigo-600" />
                            <span>Behavior Engine</span>
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-serif-elegant font-normal text-charcoal">
                        Digital Growth Twin<span className="text-indigo-600">.</span>
                    </h1>
                    <p className="text-charcoal/60 text-xs md:text-sm mt-1">
                        A dynamic behavioral mirror that learns when and how you actually execute best.
                    </p>
                </div>

                {/* Behavioral Intelligence Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-6 bg-cream-card border border-cream-dark/80 rounded-3xl shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold text-charcoal/40 tracking-wider">Consistency Index</span>
                            <FaCheckCircle size={14} className="text-emerald-600" />
                        </div>
                        <div className="text-3xl font-serif-elegant font-normal text-charcoal">
                            {twin.consistencyIndex || 85}%
                        </div>
                        <p className="text-[11px] text-emerald-700 font-medium">Trajectory: Compounding</p>
                    </div>

                    <div className="p-6 bg-cream-card border border-cream-dark/80 rounded-3xl shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold text-charcoal/40 tracking-wider">Optimal Session</span>
                            <FaClock size={14} className="text-indigo-600" />
                        </div>
                        <div className="text-3xl font-serif-elegant font-normal text-charcoal">
                            {twin.optimalSessionDurationMinutes || 35}m
                        </div>
                        <p className="text-[11px] text-charcoal/50">Highest completion rate</p>
                    </div>

                    <div className="p-6 bg-cream-card border border-cream-dark/80 rounded-3xl shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold text-charcoal/40 tracking-wider">Peak Focus Window</span>
                            <FaBolt size={14} className="text-amber-500" />
                        </div>
                        <div className="text-2xl font-serif-elegant font-normal text-charcoal truncate">
                            {twin.peakProductiveWindow || "Morning"}
                        </div>
                        <p className="text-[11px] text-indigo-600 font-medium">Auto-prioritized by AI</p>
                    </div>

                    <div className="p-6 bg-cream-card border border-cream-dark/80 rounded-3xl shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold text-charcoal/40 tracking-wider">Velocity</span>
                            <FaChartLine size={14} className="text-purple-600" />
                        </div>
                        <div className="text-3xl font-serif-elegant font-normal text-charcoal">
                            {twin.completionVelocity || 1.2}
                        </div>
                        <p className="text-[11px] text-charcoal/50">Actions completed / day</p>
                    </div>
                </div>

                {/* Behavioral Coaching Insights */}
                <div className="p-8 bg-dark-green text-sand border border-emerald-800/20 rounded-[2.8rem] shadow-xl space-y-4">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                        <FaLightbulb size={13} className="text-emerald-400" />
                        <span>AI Behavioral Insights & Adjustments</span>
                    </div>

                    <div className="space-y-3">
                        {insights.map((insight, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-4 bg-emerald-950/40 rounded-2xl border border-emerald-800/20 text-xs sm:text-sm text-sand/90">
                                <span className="text-emerald-400 font-bold">•</span>
                                <p className="leading-relaxed font-medium">{insight}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Proof & Reflection Feed */}
                <div className="space-y-4">
                    <h3 className="text-xl sm:text-2xl font-serif-elegant font-normal text-charcoal">
                        Verified Execution & Reflection Journal
                    </h3>

                    {reflections.length > 0 ? (
                        <div className="space-y-3">
                            {reflections.map((r) => (
                                <div
                                    key={r._id}
                                    className="p-5 bg-white border border-cream-dark/80 rounded-2xl shadow-xs space-y-2"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-0.5">
                                            <span className="text-[10px] uppercase font-bold text-charcoal/40">
                                                {new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • Verified Move
                                            </span>
                                            <h4 className="text-sm font-bold text-charcoal">
                                                {r.whatAccomplished || "Action Completed"}
                                            </h4>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold px-2.5 py-1 bg-cream rounded-full border border-cream-dark/60 text-charcoal/70">
                                                Difficulty: {r.difficultyRating}/5
                                            </span>
                                            {r.movedCloserToGoal && (
                                                <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                                                    +Progress
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {r.keyInsight && (
                                        <p className="text-xs text-charcoal/60 bg-cream/40 p-2.5 rounded-xl italic font-serif-elegant">
                                            "{r.keyInsight}"
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center bg-white border border-cream-dark/60 rounded-2xl">
                            <p className="text-xs text-charcoal/50">
                                No reflections logged yet. Complete focus sessions on your Dashboard to build your journal.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
