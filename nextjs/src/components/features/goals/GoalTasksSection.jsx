"use client";

import React from "react";
import { FaPlus, FaCheckCircle, FaClock, FaPlay } from "react-icons/fa";

export default function GoalTasksSection({
  tasks = [],
  newTaskTitle,
  setNewTaskTitle,
  onAddTask,
  isAddingTask,
  onExecuteTask
}) {
  return (
    <div className="p-8 bg-cream-card border border-cream-dark/80 rounded-[2.8rem] shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50">
            Execution Alignment
          </span>
          <h3 className="text-xl font-serif-elegant font-normal text-charcoal">
            Daily Linked Actions
          </h3>
        </div>
        <span className="text-xs text-charcoal/50">
          Sync daily effort directly with this trajectory
        </span>
      </div>

      {/* Quick Add Task Input */}
      <form onSubmit={onAddTask} className="flex gap-2">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a daily micro-action to move this trajectory forward..."
          className="flex-1 bg-white border border-cream-dark/80 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-charcoal/40"
        />
        <button
          type="submit"
          disabled={isAddingTask || !newTaskTitle.trim()}
          className="px-5 py-2.5 bg-charcoal hover:bg-black text-white text-xs font-bold rounded-2xl disabled:opacity-40 transition cursor-pointer flex items-center gap-1.5 shrink-0 select-none"
        >
          <FaPlus size={10} />
          <span>{isAddingTask ? "Adding..." : "Add Action"}</span>
        </button>
      </form>

      {/* Task List */}
      <div className="space-y-2.5">
        {tasks.length === 0 ? (
          <p className="text-xs text-charcoal/50 italic text-center py-6">
            No daily tasks linked to this trajectory yet. Add one above!
          </p>
        ) : (
          tasks.map((task) => {
            const isCompleted = task.status === "completed";
            return (
              <div
                key={task._id}
                className="p-4 bg-white border border-cream-dark/80 rounded-2xl flex items-center justify-between gap-3 shadow-2xs hover:border-charcoal/20 transition"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`shrink-0 ${isCompleted ? "text-emerald-600" : "text-charcoal/30"}`}>
                    <FaCheckCircle size={16} />
                  </div>
                  <div className="truncate">
                    <p className={`text-xs font-bold truncate ${isCompleted ? "line-through text-charcoal/40" : "text-charcoal"}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-charcoal/50 flex items-center gap-1">
                        <FaClock size={9} />
                        <span>{task.timeBlockMinutes || 35}m block</span>
                      </span>
                      {task.completionProof?.proofText && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
                          Proof logged
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {!isCompleted && (
                  <button
                    type="button"
                    onClick={() => onExecuteTask(task)}
                    className="px-3.5 py-1.5 bg-cream-card hover:bg-cream border border-cream-dark text-charcoal text-xs font-bold rounded-full transition cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <span>Execute</span>
                    <FaPlay size={8} />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
