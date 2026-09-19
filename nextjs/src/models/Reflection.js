import mongoose from "mongoose";

const reflectionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    content: { type: String, required: true },
    mood: { type: String, default: "Focused" },
    insight: { type: String, default: "" },
    category: { type: String, default: "General" }
  },
  { timestamps: true }
);

export const Reflection = mongoose.models.Reflection || mongoose.model("Reflection", reflectionSchema);
