"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/api/axios";
import { toast } from "react-hot-toast";
import { FaPlus, FaBolt, FaBullseye } from "react-icons/fa";
import MainSlideBar from "@/components/layout/MainSlideBar";
import PageLoader from "@/components/common/loaders/pagesLoader";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import GoalStatsCards from "@/components/features/goals/GoalStatsCards";
import GoalFilters from "@/components/features/goals/GoalFilters";
import GoalPortfolioCard from "@/components/features/goals/GoalPortfolioCard";
import CreateGoalModal from "@/components/features/goals/CreateGoalModal";

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("active");
  const [deletingId, setDeletingId] = useState(null);

  const fetchGoals = async () => {
    try {
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
    let isCancelled = false;
    async function loadData() {
      try {
        const res = await axiosInstance.get(`/goals?status=${filterStatus}`);
        if (!isCancelled) {
          setGoals(res.data.goals || []);
          if (res.data.stats) {
            setStats(res.data.stats);
          }
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Fetch goals error:", error);
          toast.error("Failed to load goal trajectories");
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }
    loadData();
    return () => {
      isCancelled = true;
    };
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
      setGoals((prev) => prev.filter((g) => g._id !== goalId));
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
        {/* Page Header */}
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

          <Button
            variant="primary"
            size="md"
            leftIcon={<FaPlus size={11} />}
            onClick={() => setShowCreateModal(true)}
            className="w-fit shadow-md"
          >
            New Goal Trajectory
          </Button>
        </div>

        {/* Portfolio Stats Ribbon */}
        {stats && <GoalStatsCards stats={stats} />}

        {/* Filter Toolbar */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <GoalFilters
            currentFilter={filterStatus}
            onSelectFilter={setFilterStatus}
          />
          <span className="text-xs font-medium text-charcoal/50">
            Showing <strong>{goals.length}</strong> {filterStatus} trajectories
          </span>
        </div>

        {/* Goals Grid or Empty State */}
        {loading ? (
          <div className="flex justify-center py-20">
            <PageLoader message="Loading goal trajectories..." />
          </div>
        ) : goals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <GoalPortfolioCard
                key={goal._id}
                goal={goal}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteGoal}
                isDeleting={deletingId === goal._id}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<FaBullseye />}
            title={`No ${filterStatus === "all" ? "" : filterStatus} goals found`}
            description="Transform an ambitious aspiration into actionable phases, proofed deliverables, and daily time blocks."
            actionLabel="Design First Trajectory"
            onAction={() => setShowCreateModal(true)}
          />
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
