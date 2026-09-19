import connectDB from "@/lib/db";
import { Task } from "@/models/Task";
import { verifyAuth } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);
    const { id } = await params;

    const task = await Task.findOneAndUpdate(
      { _id: id, userId },
      { status: "abandoned" },
      { returnDocument: 'after' }
    );

    if (!task) {
      return Response.json({ message: "Task not found" }, { status: 404 });
    }

    return Response.json({ task, message: "Task abandoned" }, { status: 200 });
  } catch (error) {
    if (!error.message?.includes("token")) console.error("Task Abandon Error:", error);
    const status = error.message?.includes("token") ? 401 : 500;
    return Response.json({ message: error.message || "Failed to abandon task" }, { status });
  }
}
