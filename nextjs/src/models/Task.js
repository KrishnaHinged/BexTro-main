import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    goalId: { type: mongoose.Schema.Types.ObjectId, ref: "Goal", index: true },
    title: { type: String, required: true },
    category: { type: String, default: "Personal" },
    timeBlockMinutes: { type: Number, default: 30 },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "abandoned"],
      default: "pending",
      index: true
    },
    startedAt: { type: Date },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

taskSchema.index({ userId: 1, status: 1, createdAt: -1 });

export const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);
