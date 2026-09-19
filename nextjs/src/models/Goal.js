import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  targetDate: { type: Date },
  targetWeeks: { type: Number, default: 2 },
  keyDeliverable: { type: String, default: "" },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  proofUrl: { type: String, default: "" },
  proofType: { type: String, default: "" },
  proofText: { type: String, default: "" },
  reflection: { type: String, default: "" },
  proofPostId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" }
});

const goalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, default: "Career" },
    motivation: { type: String, default: "" },
    deadline: { type: Date },
    status: {
      type: String,
      enum: ["active", "completed", "paused", "abandoned"],
      default: "active",
      index: true
    },
    startingState: { type: String, default: "" },
    currentState: { type: String, default: "In progress execution" },
    targetState: { type: String, default: "" },
    measurableMetrics: [{ type: String }],
    milestones: [milestoneSchema],
    weeklyTargets: [{ type: String }],
    starterDailyTasks: [mongoose.Schema.Types.Mixed],
    aiInsight: { type: String, default: "" },
    isPrimary: { type: Boolean, default: false },
    progress: { type: Number, default: 0 },
    momentum: { type: String, default: "Steady" },
    consistency: { type: Number, default: 100 },
    riskLevel: { type: String, default: "Low" },
    estimatedCompletionDate: { type: Date }
  },
  { timestamps: true }
);

goalSchema.index({ userId: 1, status: 1 });

export const Goal = mongoose.models.Goal || mongoose.model("Goal", goalSchema);
