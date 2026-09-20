"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/api/axios";
import { toast } from "react-hot-toast";
import { FaClock } from "react-icons/fa";
import MainSlideBar from "@/components/layout/MainSlideBar";
import PageLoader from "@/components/common/loaders/pagesLoader";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import GoalNextMountainBanner from "@/components/features/goals/GoalNextMountainBanner";
import GoalTrajectoryCard from "@/components/features/goals/GoalTrajectoryCard";
import MilestoneList from "@/components/features/goals/MilestoneList";
import GoalTasksSection from "@/components/features/goals/GoalTasksSection";
import GoalReflectionsSection from "@/components/features/goals/GoalReflectionsSection";
import ExecutionModal from "@/components/features/execution/ExecutionModal";
import MilestoneProofModal from "@/components/features/goals/MilestoneProofModal";

const MOMENTUM_BADGES = {
  Accelerating: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Strong: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Steady: "bg-amber-50 text-amber-700 border-amber-200",
  "At Risk": "bg-rose-50 text-rose-700 border-rose-200"
};

export default function GoalDetailPage() {
  const params = useParams();
  const goalId = params?.goalId;
  const router = useRouter();

  const [goal, setGoal] = useState(null);
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
      setTasks(res.data.tasks || []);
    } catch (error) {
      console.error("Fetch goal details error:", error);
      toast.error("Failed to load goal trajectory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!goalId) return;
    let isCancelled = false;
    async function load() {
      try {
        const res = await axiosInstance.get(`/goals/${goalId}`);
        if (!isCancelled) {
          setGoal(res.data.goal);
          setTasks(res.data.tasks || []);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Fetch goal details error:", error);
          toast.error("Failed to load goal trajectory");
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      isCancelled = true;
    };
  }, [goalId]);

  const handleMilestoneAction = (milestone) => {
    setProofTargetMilestone(milestone);
  };

  const handleClimbMountain = (milestone) => {
    setActiveExecutionTask({
      title: `Execute Milestone: ${milestone.title}`,
      goalId: goal._id,
      timeBlockMinutes: 35,
      category: goal.category
    });
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
        <div className="flex-1 p-10 text-center space-y-4">
          <h2 className="text-2xl font-serif-elegant">Goal Not Found</h2>
          <Button variant="primary" size="md" onClick={() => router.push("/goals")}>
            Back to Goals
          </Button>
        </div>
      </div>
    );
  }

  const pendingMilestones = goal.milestones?.filter((m) => !m.completed && m.status !== "completed") || [];
  const nextMountain = pendingMilestones[0];
  const milestonesWithProof = goal.milestones?.filter(
    (m) => (m.completed || m.status === "completed") && (m.proofUrl || m.proof?.proofUrl)
  ) || [];
  const completedTasksWithProof = tasks.filter(
    (t) => t.status === "completed" && (t.completionProof?.proofText || t.reflectionNote)
  );

  return (
    <div className="flex min-h-screen bg-cream text-charcoal font-sans-clean">
      <MainSlideBar />

      <div className="flex-1 p-6 md:p-10 overflow-y-auto max-w-5xl mx-auto space-y-8">
        {/* Page Header */}
        <PageHeader
          title={goal.title}
          subtitle={goal.motivation ? `"${goal.motivation}"` : undefined}
          backUrl="/goals"
          backLabel="All Goals"
          tag={goal.category}
        />

        {/* Trajectory Meta Chips */}
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border ${
              MOMENTUM_BADGES[goal.momentum] || "bg-cream text-charcoal/70 border-cream-dark"
            }`}
          >
            Momentum: {goal.momentum || "Steady"}
          </span>
          <span className="text-xs font-bold text-charcoal/50 bg-cream-card px-3 py-1 rounded-full border border-cream-dark/60">
            Risk:{" "}
            <strong className={goal.riskLevel === "High" ? "text-rose-600" : "text-emerald-700"}>
              {goal.riskLevel || "Low"}
            </strong>
          </span>
          {goal.estimatedCompletionDate && (
            <span className="text-xs font-medium text-charcoal/60 flex items-center gap-1">
              <FaClock size={11} className="text-charcoal/40" />
              <span>
                Est. Target:{" "}
                <strong>
                  {new Date(goal.estimatedCompletionDate).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  })}
                </strong>
              </span>
            </span>
          )}
        </div>

        {/* Next Mountain Hero Banner */}
        {nextMountain && (
          <GoalNextMountainBanner
            milestone={nextMountain}
            onUploadProof={handleMilestoneAction}
            onClimbMountain={handleClimbMountain}
          />
        )}

        {/* 1. Visual Trajectory Timeline Card */}
        <GoalTrajectoryCard goal={goal} />

        {/* 2. Sequential Milestones List */}
        <MilestoneList
          milestones={goal.milestones || []}
          onUploadProof={handleMilestoneAction}
          onClimbMountain={handleClimbMountain}
        />

        {/* 3. Proof of Work & Reflections Section */}
        <GoalReflectionsSection
          milestonesWithProof={milestonesWithProof}
          completedTasksWithProof={completedTasksWithProof}
        />

        {/* 4. Daily Linked Actions Section */}
        <GoalTasksSection
          tasks={tasks}
          newTaskTitle={newTaskTitle}
          setNewTaskTitle={setNewTaskTitle}
          onAddTask={handleCreateLinkedTask}
          isAddingTask={addingTask}
          onExecuteTask={(task) => setActiveExecutionTask(task)}
        />
      </div>

      {/* Execution Session Modal */}
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
