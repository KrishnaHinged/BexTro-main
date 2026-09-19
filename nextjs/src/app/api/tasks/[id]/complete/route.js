import connectDB from "@/lib/db";
import { Task } from "@/models/Task";
import { Goal } from "@/models/Goal";
import { User } from "@/models/userModel";
import { verifyAuth } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);
    const { id } = await params;

    const task = await Task.findOneAndUpdate(
      { _id: id, userId },
      { status: "completed", completedAt: new Date() },
      { returnDocument: 'after' }
    );

    if (!task) {
      return Response.json({ message: "Task not found" }, { status: 404 });
    }

    // Reward user XP and increment stats
    await User.findByIdAndUpdate(userId, {
      $inc: { "stats.totalCompleted": 1, totalXP: 50 }
    });

    return Response.json({ task, message: "Task completed! Progress recorded." }, { status: 200 });
  } catch (error) {
    if (!error.message?.includes("token")) console.error("Task Complete Error:", error);
    const status = error.message?.includes("token") ? 401 : 500;
    return Response.json({ message: error.message || "Failed to complete task" }, { status });
  }
}
