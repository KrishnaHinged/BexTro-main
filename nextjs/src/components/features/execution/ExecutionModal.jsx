"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/api/axios";
import { toast } from "react-hot-toast";
import { FaLightbulb, FaCheck, FaPause, FaPlay, FaPlus } from "react-icons/fa";
import ReflectionModal from "./ReflectionModal";

const ExecutionModal = ({ task, onClose, onSessionFinished }) => {
    const plannedMinutes = task?.timeBlockMinutes || 35;
    const [secondsLeft, setSecondsLeft] = useState(plannedMinutes * 60);
    const [isActive, setIsActive] = useState(true);
    const [totalElapsedSeconds, setTotalElapsedSeconds] = useState(0);
    const [notes, setNotes] = useState("");
    const [aiHelp, setAiHelp] = useState(null);
    const [loadingAi, setLoadingAi] = useState(false);
    const [showReflection, setShowReflection] = useState(false);

    const timerRef = useRef(null);

    // Initial start call
    useEffect(() => {
        if (task?._id) {
            axiosInstance.post(`/tasks/${task._id}/start`).catch(err => {
                console.error("Start task call failed:", err);
            });
        }
    }, [task?._id]);

    // Timer Interval
    useEffect(() => {
        if (isActive) {
            timerRef.current = setInterval(() => {
                setSecondsLeft(prev => Math.max(0, prev - 1));
                setTotalElapsedSeconds(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isActive]);

    const formatTime = (totalSeconds) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const handleExtend = (extraMinutes = 10) => {
        setSecondsLeft(prev => prev + extraMinutes * 60);
        toast.success(`+${extraMinutes} minutes added`);
    };

    const handleGetAIHelp = async () => {
        setLoadingAi(true);
        try {
            const prompt = `Give a 3-bullet action breakdown to execute this task immediately: "${task?.title}" (Goal: ${task?.goalTitle || "Self Improvement"})`;
            const res = await axiosInstance.post("/goals/ai-plan", {
                title: task?.title || "Focus Action",
                description: prompt,
                category: task?.category || "Personal"
            });
            const plan = res.data.plan;
            setAiHelp(plan?.starterDailyTasks?.map(t => t.title) || [
                "Break task into 1 clear initial output.",
                "Eliminate tabs and secondary distractions.",
                "Execute the first 10 minutes continuously."
            ]);
        } catch (error) {
            setAiHelp([
                "Define the very first line or action you need to produce.",
                "Work for 15 minutes straight before evaluating quality.",
                "Capture questions in the notes box below without breaking flow."
            ]);
        } finally {
            setLoadingAi(false);
        }
    };

    const handleCompleteSession = () => {
        setIsActive(false);
        setShowReflection(true);
    };

    const handleAbandonSession = async () => {
        setIsActive(false);
        if (task?._id) {
            try {
                await axiosInstance.post(`/tasks/${task._id}/abandon`, { reason: "User dropped during focus" });
                toast("Task dropped. Tomorrow is another move.", { icon: "🕊️" });
            } catch (err) {
                console.error("Abandon task error:", err);
            }
        }
        onClose();
    };

    if (showReflection) {
        return (
            <ReflectionModal
                task={task}
                actualMinutes={Math.max(1, Math.round(totalElapsedSeconds / 60))}
                onClose={onClose}
                onCompleted={() => {
                    if (onSessionFinished) onSessionFinished();
                    onClose();
                }}
            />
        );
    }

    const progressPercentage = Math.min(100, Math.round(((plannedMinutes * 60 - secondsLeft) / (plannedMinutes * 60)) * 100));

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-dark-green/90 backdrop-blur-md z-[90] flex items-center justify-center p-4 font-sans-clean"
            >
                <motion.div
                    initial={{ scale: 0.95, y: 15 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 15 }}
                    className="bg-cream-card border border-cream-dark/80 rounded-[2.8rem] max-w-xl w-full p-8 sm:p-10 shadow-2xl text-charcoal flex flex-col items-center relative overflow-hidden"
                >
                    {/* Top status bar */}
                    <div className="w-full flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal/60">
                                Execution Mode
                            </span>
                        </div>
                        <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                            {task?.category || "Focus"}
                        </span>
                    </div>

                    {/* Task Title & Goal */}
                    <div className="text-center space-y-1 mb-6 max-w-md">
                        <h1 className="text-2xl sm:text-3xl font-serif-elegant font-normal text-charcoal leading-snug">
                            {task?.title || "Focus Execution"}
                        </h1>
                        {task?.goalTitle && (
                            <p className="text-xs text-charcoal/50 font-medium">
                                Target Trajectory: <span className="font-semibold text-charcoal/80">{task.goalTitle}</span>
                            </p>
                        )}
                    </div>

                    {/* Circular / Large Timer display */}
                    <div className="my-4 text-center">
                        <div className="text-6xl sm:text-7xl font-mono font-bold tracking-tighter text-charcoal">
                            {formatTime(secondsLeft)}
                        </div>
                        <div className="text-xs font-semibold text-charcoal/40 mt-1">
                            {progressPercentage}% of planned block completed
                        </div>
                    </div>

                    {/* Quick AI Assistance Dropdown */}
                    {aiHelp && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="w-full bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-4 my-3 text-left space-y-1.5 text-xs text-indigo-950"
                        >
                            <span className="font-bold text-[10px] uppercase text-indigo-600 block">AI Micro Breakdown</span>
                            {aiHelp.map((step, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <span className="font-bold text-indigo-500">{idx + 1}.</span>
                                    <span>{step}</span>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {/* In-Session Notes Box */}
                    <div className="w-full my-3">
                        <input
                            type="text"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Type quick in-session notes or blockers here..."
                            className="w-full px-4 py-2.5 bg-white border border-cream-dark/80 rounded-2xl text-xs text-charcoal placeholder-charcoal/30 outline-none focus:border-indigo-500 shadow-sm"
                        />
                    </div>

                    {/* Primary Action Controls */}
                    <div className="flex flex-wrap justify-center gap-3 w-full mt-4">
                        <button
                            onClick={() => setIsActive(!isActive)}
                            className={`px-6 py-3 rounded-full text-xs font-bold transition-all cursor-pointer ${
                                isActive 
                                    ? "bg-amber-500 hover:bg-amber-600 text-white shadow-md"
                                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                            }`}
                        >
                            {isActive ? "Pause Timer" : "Resume Timer"}
                        </button>

                        <button
                            onClick={() => handleExtend(10)}
                            className="px-5 py-3 bg-white border border-cream-dark/80 hover:bg-cream text-charcoal text-xs font-bold rounded-full transition shadow-sm cursor-pointer"
                        >
                            +10 Min
                        </button>

                        <button
                            onClick={handleGetAIHelp}
                            disabled={loadingAi}
                            className="px-5 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-full transition shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                        >
                            <FaLightbulb size={12} className="text-indigo-600" />
                            <span>{loadingAi ? "Thinking..." : "Breakdown"}</span>
                        </button>

                        <button
                            onClick={handleCompleteSession}
                            className="px-8 py-3 bg-charcoal hover:bg-black text-white text-xs font-bold rounded-full shadow-lg hover:scale-105 transition cursor-pointer flex items-center gap-1.5"
                        >
                            <FaCheck size={11} />
                            <span>Complete Move</span>
                        </button>
                    </div>

                    {/* Abandon Link */}
                    <button
                        onClick={handleAbandonSession}
                        className="mt-6 text-[11px] font-semibold text-charcoal/40 hover:text-rose-600 transition cursor-pointer"
                    >
                        Abandon Session
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ExecutionModal;
