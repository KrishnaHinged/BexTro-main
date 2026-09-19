import connectDB from "@/lib/db";
import { Goal } from "@/models/Goal";
import { Post } from "@/models/Post";
import { Reflection } from "@/models/Reflection";
import { User } from "@/models/userModel";
import { verifyAuth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);
    const { id, milestoneId } = await params;

    const goal = await Goal.findOne({ _id: id, userId });
    if (!goal) {
      return Response.json({ message: "Goal not found" }, { status: 404 });
    }

    const milestone = goal.milestones.id(milestoneId);
    if (!milestone) {
      return Response.json({ message: "Milestone not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const proofType = formData.get("proofType") || "image";
    const proofText = formData.get("proofText") || milestone.keyDeliverable || "";
    const reflection = formData.get("reflection") || "";
    const shareToFeed = formData.get("shareToFeed") === "true" || formData.get("shareToFeed") === true;
    const file = formData.get("proofFile");
    let proofUrl = formData.get("proofUrl") || "";

    if (file && typeof file === "object" && file.name) {
      const { validateAndExtractUpload } = await import("@/lib/uploadSecurity");
      const { safeFilename, buffer } = await validateAndExtractUpload(file, "milestoneProof");

      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });

      const filePath = path.join(uploadsDir, safeFilename);
      await writeFile(filePath, buffer);
      proofUrl = `/uploads/${safeFilename}`;
    }

    // Mark milestone as completed
    milestone.completed = true;
    milestone.completedAt = new Date();
    if (proofUrl) milestone.proofUrl = proofUrl;
    if (proofType) milestone.proofType = proofType;
    if (proofText) milestone.proofText = proofText;
    if (reflection) milestone.reflection = reflection;

    // Save reflection if present
    if (reflection && reflection.trim()) {
      await Reflection.create({
        userId,
        content: reflection.trim(),
        mood: "Accomplished",
        insight: `Milestone completed: ${milestone.title}`,
        category: goal.category || "General"
      });
    }

    // Share to feed if user selected
    if (shareToFeed) {
      const validProofType = ["image", "video", "blog", "link"].includes(proofType) ? proofType : "blog";
      await Post.create({
        user: userId,
        challengeText: `Milestone Achieved: ${milestone.title}`,
        proofType: validProofType,
        proofUrl: proofUrl || "https://bextro.app",
        description: proofText + (reflection ? `\n\nReflection: ${reflection}` : ""),
        timelineTaken: milestone.targetWeeks ? milestone.targetWeeks * 7 : 7,
        visibility: "public"
      });
    }

    // Dynamically recalculate goal trajectory progress
    const totalMilestones = goal.milestones?.length || 1;
    const completedCount = goal.milestones?.filter(m => m.completed)?.length || 1;
    goal.progress = Math.min(100, Math.round((completedCount / totalMilestones) * 100));
    if (goal.progress >= 100) {
      goal.status = "completed";
    }
    goal.momentum = "Accelerating";

    await goal.save();

    // Award XP
    await User.findByIdAndUpdate(userId, {
      $inc: { "stats.totalCompleted": 1, totalXP: 100 }
    });

    return Response.json({
      message: "Milestone completed and verified!",
      goal,
      success: true
    }, { status: 200 });

  } catch (error) {
    const { handleApiError } = await import("@/lib/auth");
    return handleApiError(error, "Milestone Proof Submission");
  }
}
