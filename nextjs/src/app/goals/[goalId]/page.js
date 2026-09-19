"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axiosInstance, { ROOT_URL } from "@/api/axios";
import { toast } from "react-hot-toast";
import { 
    FaArrowLeft, 
    FaBrain, 
    FaCheck, 
    FaClock, 
    FaMountain, 
    FaPlay, 
    FaPlus, 
    FaCheckCircle, 
    FaExternalLinkAlt, 
    FaUpload,
} from "react-icons/fa";
import MainSlideBar from "@/components/layout/MainSlideBar";
import PageLoader from "@/components/common/loaders/pagesLoader";
import ExecutionModal from "@/components/features/execution/ExecutionModal";
import MilestoneProofModal from "@/components/features/goals/MilestoneProofModal";

export default function GoalDetailPage() {
    const params = useParams();
    const goalId = params?.goalId;
    const router = useRouter();

    const [goal, setGoal] = useState(null);
    const [trajectory, setTrajectory] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeExecutionTask, setActiveExecutionTask] = useState(null);
    const [proofTargetMilestone, setProofTargetMilestone] = useState(null);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [addingTask, setAddingTask] = useState(false);

    const fetchGoalDetails = async () => {
        if (!goalId) return;
        try {
            const res = await axiosInstance.get(`/goals/${goalId}`);
            setGoal(res.data.goal);
            setTrajectory(res.data.trajectory);
            setTasks(res.data.tasks || []);
        } catch (error) {
            console.error("Fetch goal details error:", error);
            toast.error("Failed to load goal trajectory");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoalDetails();
    }, [goalId]);

    const handleMilestoneAction = (milestone) => {
        setProofTargetMilestone(milestone);
    };

    const handleCreateLinkedTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        setAddingTask(true);
        try {
            await axiosInstance.post("/tasks", {
                title: newTaskTitle,
                goalId: goalId,
                category: goal.category,
                timeBlockMinutes: 35
            });
            setNewTaskTitle("");
            toast.success("Action added to trajectory!");
            fetchGoalDetails();
        } catch (error) {
            console.error("Add task error:", error);
            toast.error("Failed to add task");
        } finally {
            setAddingTask(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-cream text-charcoal font-sans-clean">
                <MainSlideBar />
                <div className="flex-1 flex items-center justify-center">
                    <PageLoader message="Evaluating goal trajectory..." />
                </div>
            </div>
        );
    }

    if (!goal) {
        return (
            <div className="flex min-h-screen bg-cream text-charcoal font-sans-clean">
                <MainSlideBar />
                <div className="flex-1 p-10 text-center">
                    <h2 className="text-2xl font-serif-elegant">Goal Not Found</h2>
                    <button onClick={() => router.push("/goals")} className="mt-4 px-6 py-2 bg-charcoal text-white rounded-full text-xs font-bold cursor-pointer">
                        Back to Goals
                    </button>
                </div>
            </div>
        );
    }

    const momentumBadgeColors = {
        "Accelerating": "bg-emerald-50 text-emerald-700 border-emerald-200",
        "Strong": "bg-indigo-50 text-indigo-700 border-indigo-200",
        "Steady": "bg-amber-50 text-amber-700 border-amber-200",
        "At Risk": "bg-rose-50 text-rose-700 border-rose-200"
    };

    const completedMilestones = goal.milestones?.filter(m => m.status === "completed") || [];
    const pendingMilestones = goal.milestones?.filter(m => m.status !== "completed") || [];
    const nextMountain = pendingMilestones[0];
    
    const milestonesWithProof = goal.milestones?.filter(m => m.status === "completed" && m.proof?.proofUrl) || [];
    const completedTasksWithProof = tasks.filter(t => t.status === "completed" && (t.completionProof?.proofText || t.reflectionNote));

    return (
        <div className="flex min-h-screen bg-cream text-charcoal font-sans-clean">
            <MainSlideBar />

            <div className="flex-1 p-6 md:p-10 overflow-y-auto max-w-5xl mx-auto space-y-8">
                {/* Back button & Tag */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.push("/goals")}
                        className="text-xs font-bold text-charcoal/60 hover:text-charcoal transition flex items-center gap-1.5 cursor-pointer"
                    >
                        <FaArrowLeft size={10} />
                        <span>All Goals</span>
                    </button>
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-white border border-cream-dark/80 rounded-full text-indigo-600 shadow-xs">
                        {goal.category}
                    </span>
                </div>

                {/* Hero Goal Header */}
                <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${momentumBadgeColors[goal.momentum] || "bg-cream text-charcoal/70 border-cream-dark"}`}>
                            Momentum: {goal.momentum || "Steady"}
                        </span>
                        <span className="text-xs font-bold text-charcoal/50 bg-cream-card px-3 py-1 rounded-full border border-cream-dark/60">
                            Risk: <strong className={goal.riskLevel === "High" ? "text-rose-600" : "text-emerald-700"}>{goal.riskLevel || "Low"}</strong>
                        </span>
                        {goal.estimatedCompletionDate && (
                            <span className="text-xs font-medium text-charcoal/60 flex items-center gap-1">
                                <FaClock size={11} className="text-charcoal/40" />
                                <span>Est. Target: <strong>{new Date(goal.estimatedCompletionDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</strong></span>
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif-elegant font-normal text-charcoal">
                        {goal.title}
                    </h1>

                    {goal.motivation && (
                        <p className="text-xs sm:text-sm text-charcoal/70 italic font-serif-elegant max-w-2xl">
                            "{goal.motivation}"
                        </p>
                    )}
                </div>

                {/* NEXT MOUNTAIN BANNER */}
                {nextMountain && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 bg-dark-green text-sand border border-emerald-800/30 rounded-[2.5rem] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <FaMountain size={12} className="text-emerald-400" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                                    What is the next mountain?
                                </span>
                            </div>
                            <h3 className="text-lg font-serif-elegant text-white">
                                {nextMountain.title}
                            </h3>
                            {nextMountain.keyDeliverable && (
                                <p className="text-xs text-sand/70">
                                    Deliverable: <strong className="text-sand">{nextMountain.keyDeliverable}</strong>
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-2.5 self-start sm:self-center">
                            <button
                                onClick={() => setProofTargetMilestone(nextMountain)}
                                className="px-5 py-2.5 bg-emerald-800/80 hover:bg-emerald-700 text-sand text-xs font-bold rounded-full border border-emerald-600/40 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                            >
                                <FaUpload size={10} />
                                <span>Upload Proof</span>
                            </button>

                            <button
                                onClick={() => setActiveExecutionTask({
                                    title: `Execute Milestone: ${nextMountain.title}`,
                                    goalId: goal._id,
                                    timeBlockMinutes: 35,
                                    category: goal.category
                                })}
                                className="px-6 py-2.5 bg-sand hover:bg-white text-charcoal text-xs font-bold rounded-full shadow-md transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap"
                            >
                                <span>Climb Mountain</span>
                                <FaPlay size={9} />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* 1. VISUAL TRAJECTORY TIMELINE */}
                <div className="p-8 bg-cream-card border border-cream-dark/80 rounded-[2.8rem] shadow-xl space-y-6">
                    <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50">
                            Trajectory Architecture
                        </span>
                        <span className="text-sm font-extrabold text-indigo-600 font-mono">
                            {goal.progress || 0}% Complete
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 bg-white border border-cream-dark/80 rounded-2xl space-y-1 shadow-xs">
                            <span className="text-[10px] uppercase font-bold text-charcoal/40 tracking-wider">Start State</span>
                            <p className="text-xs font-bold text-charcoal">{goal.startingState || "Initiation"}</p>
                        </div>

                        <div className="p-4 bg-indigo-50/70 border border-indigo-200/80 rounded-2xl space-y-1 shadow-xs relative">
                            <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">Current State</span>
                            <p className="text-xs font-bold text-indigo-950">{goal.currentState || "In progress execution"}</p>
                        </div>

                        <div className="p-4 bg-white border border-cream-dark/80 rounded-2xl space-y-1 shadow-xs">
                            <span className="text-[10px] uppercase font-bold text-charcoal/40 tracking-wider">Target State</span>
                            <p className="text-xs font-bold text-charcoal">{goal.targetState || "Full Mastery"}</p>
                        </div>
                    </div>

                    <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-cream-dark/80">
                        <div
                            className="h-full bg-charcoal rounded-full transition-all duration-700"
                            style={{ width: `${goal.progress || 5}%` }}
                        ></div>
                    </div>

                    <div className="flex justify-between text-xs text-charcoal/50 font-medium">
                        <span>Consistency Index: <strong className="text-charcoal">{goal.consistency || 100}%</strong></span>
                        <span>Deliverables: <strong className="text-charcoal">{completedMilestones.length}/{goal.milestones?.length} Completed</strong></span>
                    </div>
                </div>

                {/* AI Strategic Bottleneck & Consistency Insight */}
                {goal.aiInsight && (
                    <div className="p-6 bg-dark-green text-sand border border-emerald-800/20 rounded-3xl shadow-md space-y-1.5">
                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                            <FaBrain size={12} />
                            <span>AI Trajectory Intelligence</span>
                        </div>
                        <p className="text-xs sm:text-sm text-sand/90 leading-relaxed font-medium">
                            {goal.aiInsight}
                        </p>
                    </div>
                )}

                {/* 2. MILESTONES ROADMAP */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-xl sm:text-2xl font-serif-elegant font-normal text-charcoal">
                                Milestones Roadmap
                            </h3>
                            <p className="text-xs text-charcoal/50">
                                Click any milestone to submit verifiable deliverable proof.
                            </p>
                        </div>
                        <span className="text-xs text-charcoal/50 font-medium">
                            {completedMilestones.length} of {goal.milestones?.length} achieved
                        </span>
                    </div>

                    <div className="space-y-3">
                        {goal.milestones?.map((milestone, idx) => {
                            const isDone = milestone.status === "completed";

                            return (
                                <div
                                    key={milestone._id || idx}
                                    className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                                        isDone
                                            ? "bg-white/60 border-cream-dark/60 opacity-90"
                                            : "bg-white border-cream-dark/80 shadow-sm"
                                    }`}
                                >
                                    <div className="flex items-start gap-3.5">
                                        <button
                                            onClick={() => handleMilestoneAction(milestone)}
                                            className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold transition cursor-pointer mt-0.5 shrink-0 ${
                                                isDone
                                                    ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                                                    : "bg-cream border-cream-dark/80 text-charcoal hover:border-charcoal"
                                            }`}
                                            title={isDone ? "Milestone verified" : "Click to submit proof & complete"}
                                        >
                                            {isDone ? <FaCheck size={10} /> : idx + 1}
                                        </button>

                                        <div className="space-y-1">
                                            <h4 className={`text-sm font-bold text-charcoal ${isDone ? "text-charcoal/80" : ""}`}>
                                                {milestone.title}
                                            </h4>
                                            {milestone.description && (
                                                <p className="text-xs text-charcoal/60">{milestone.description}</p>
                                            )}
                                            {milestone.keyDeliverable && (
                                                <span className="inline-block text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full mt-1 border border-indigo-100">
                                                    Target Deliverable: {milestone.keyDeliverable}
                                                </span>
                                            )}

                                            {milestone.proof?.proofUrl && (
                                                <div className="pt-2 flex items-center gap-2">
                                                    {milestone.proof.proofType === "image" && (
                                                        <img 
                                                            src={milestone.proof.proofUrl.startsWith("http") ? milestone.proof.proofUrl : `${ROOT_URL}${milestone.proof.proofUrl}`}
                                                            alt="Proof"
                                                            className="w-12 h-12 object-cover rounded-lg border border-cream-dark shadow-xs"
                                                        />
                                                    )}
                                                    {milestone.proof.proofType === "link" && (
                                                        <a 
                                                            href={milestone.proof.proofUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                                                        >
                                                            <span>View Verified Link</span>
                                                            <FaExternalLinkAlt size={9} />
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap ${
                                            isDone ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-cream text-charcoal/60 border border-cream-dark/60"
                                        }`}>
                                            {isDone ? "Verified ✓" : "Pending"}
                                        </span>

                                        <button
                                            onClick={() => setProofTargetMilestone(milestone)}
                                            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition cursor-pointer flex items-center gap-1"
                                        >
                                            <FaUpload size={10} />
                                            <span>{isDone ? "Update Proof" : "Submit Proof"}</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 3. VERIFIED PROOF & PROGRESSION GRAPH */}
                {(milestonesWithProof.length > 0 || completedTasksWithProof.length > 0) && (
                    <div className="p-8 bg-cream-card border border-cream-dark/80 rounded-[2.8rem] shadow-xl space-y-4">
                        <div className="flex items-center gap-2">
                            <FaCheckCircle size={14} className="text-emerald-600" />
                            <h3 className="text-xl sm:text-2xl font-serif-elegant font-normal text-charcoal">
                                Verified Proof of Progression
                            </h3>
                        </div>
                        <p className="text-xs text-charcoal/50">
                            Undeniable deliverables and completed actions on this trajectory.
                        </p>

                        <div className="space-y-3 pt-2">
                            {milestonesWithProof.map((m, idx) => (
                                <div key={idx} className="p-4 bg-white border border-cream-dark/80 rounded-2xl shadow-xs space-y-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                                            <FaCheckCircle size={11} className="text-emerald-600" />
                                            <span>Milestone: {m.title}</span>
                                        </span>
                                        <span className="text-[10px] text-charcoal/40 font-mono">
                                            {m.completedAt ? new Date(m.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "Verified"}
                                        </span>
                                    </div>
                                    {m.proof?.proofType === "image" && (
                                        <img 
                                            src={m.proof.proofUrl.startsWith("http") ? m.proof.proofUrl : `${ROOT_URL}${m.proof.proofUrl}`}
                                            alt="Proof Screenshot"
                                            className="max-h-48 rounded-xl object-contain border border-cream-dark shadow-xs"
                                        />
                                    )}
                                    {m.proof?.proofText && (
                                        <p className="text-xs text-charcoal/70 bg-cream/40 p-2.5 rounded-xl border border-cream-dark/40 font-mono">
                                            {m.proof.proofText}
                                        </p>
                                    )}
                                </div>
                            ))}

                            {completedTasksWithProof.map((task, idx) => (
                                <div
                                    key={idx}
                                    className="p-4 bg-white border border-cream-dark/80 rounded-2xl shadow-xs space-y-1.5"
                                >
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-bold text-charcoal">{task.title}</span>
                                        <span className="text-[10px] text-charcoal/40 font-mono">
                                            {task.completedAt ? new Date(task.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "Completed"}
                                        </span>
                                    </div>
                                    {task.completionProof?.proofText && (
                                        <p className="text-xs text-charcoal/70 bg-cream/40 p-2.5 rounded-xl border border-cream-dark/40 font-mono">
                                            {task.completionProof.proofText}
                                        </p>
                                    )}
                                    {task.reflectionNote && (
                                        <p className="text-[11px] text-charcoal/60 italic">
                                            Reflection: "{task.reflectionNote}"
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. LINKED DAILY ACTIONS */}
                <div className="space-y-4 pt-4 border-t border-cream-dark/60">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl sm:text-2xl font-serif-elegant font-normal text-charcoal">
                            Linked Daily Actions
                        </h3>
                    </div>

                    {/* Quick Add Action */}
                    <form onSubmit={handleCreateLinkedTask} className="flex gap-2">
                        <input
                            type="text"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            placeholder="Add action to advance this goal (e.g. 35m DSA sliding window)"
                            className="flex-1 px-4 py-3 bg-white border border-cream-dark/80 rounded-2xl text-xs text-charcoal placeholder-charcoal/30 outline-none focus:border-indigo-500 shadow-sm font-medium"
                        />
                        <button
                            type="submit"
                            disabled={addingTask}
                            className="px-6 py-3 bg-charcoal hover:bg-black text-white text-xs font-bold rounded-2xl shadow-sm transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                        >
                            <FaPlus size={10} />
                            <span>{addingTask ? "Adding..." : "Add Move"}</span>
                        </button>
                    </form>

                    {/* Action list */}
                    <div className="space-y-2">
                        {tasks.map((task) => (
                            <div
                                key={task._id}
                                className="p-4 bg-white border border-cream-dark/80 rounded-2xl flex items-center justify-between shadow-xs"
                            >
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        {task.status === "completed" ? (
                                            <FaCheck className="text-emerald-600 text-xs" />
                                        ) : (
                                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                        )}
                                        <h5 className={`text-xs font-bold text-charcoal ${task.status === "completed" ? "line-through text-charcoal/40" : ""}`}>
                                            {task.title}
                                        </h5>
                                    </div>
                                    <span className="text-[10px] text-charcoal/40 block ml-4">
                                        {task.timeBlockMinutes || 30} mins • Status: {task.status}
                                    </span>
                                </div>

                                {task.status !== "completed" && (
                                    <button
                                        onClick={() => setActiveExecutionTask(task)}
                                        className="px-4 py-1.5 bg-charcoal hover:bg-black text-white text-[11px] font-bold rounded-full transition shadow-xs cursor-pointer flex items-center gap-1.5"
                                    >
                                        <FaPlay size={8} />
                                        <span>Execute</span>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Execution Modal */}
            {activeExecutionTask && (
                <ExecutionModal
                    task={activeExecutionTask}
                    onClose={() => setActiveExecutionTask(null)}
                    onSessionFinished={fetchGoalDetails}
                />
            )}

            {/* Milestone Proof Submission Modal */}
            {proofTargetMilestone && (
                <MilestoneProofModal
                    goal={goal}
                    milestone={proofTargetMilestone}
                    onClose={() => setProofTargetMilestone(null)}
                    onProofSubmitted={() => fetchGoalDetails()}
                />
            )}
        </div>
    );
}
