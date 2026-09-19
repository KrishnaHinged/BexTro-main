import connectDB from "@/lib/db";
import { Goal } from "@/models/Goal";
import { Task } from "@/models/Task";
import { verifyAuth, handleApiError } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);
    const { id } = await params;

    const goalDoc = await Goal.findOne({ _id: id, userId });
    if (!goalDoc) {
      return Response.json({ message: "Goal not found" }, { status: 404 });
    }

    const tasks = await Task.find({ goalId: id, userId }).sort({ createdAt: -1 });

    const totalMilestones = goalDoc.milestones?.length || 0;
    const completedMilestones = goalDoc.milestones?.filter(m => m.completed)?.length || 0;
    const milestoneProgress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : (goalDoc.progress || 0);

    const goalObj = goalDoc.toObject();
    goalObj.progress = milestoneProgress;
    goalObj.milestones = (goalObj.milestones || []).map(m => ({
      ...m,
      status: m.completed ? "completed" : "pending",
      proof: {
        proofUrl: m.proofUrl || "",
        proofType: m.proofType || "image",
        proofText: m.proofText || ""
      }
    }));

    const trajectory = {
      milestoneProgress,
      activeTasksCount: tasks.filter(t => t.status === "in_progress" || t.status === "pending").length,
      completedTasksCount: tasks.filter(t => t.status === "completed").length,
      totalMilestones,
      completedMilestones
    };

    return Response.json({ goal: goalObj, tasks: tasks || [], trajectory }, { status: 200 });
  } catch (error) {
    return handleApiError(error, "Goal Detail GET");
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);
    const { id } = await params;
    const updates = await req.json();

    const goal = await Goal.findOneAndUpdate(
      { _id: id, userId },
      { $set: updates },
      { returnDocument: 'after' }
    );

    if (!goal) {
      return Response.json({ message: "Goal not found" }, { status: 404 });
    }

    return Response.json({ goal, message: "Goal updated successfully" }, { status: 200 });
  } catch (error) {
    return handleApiError(error, "Goal Detail PUT");
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);
    const { id } = await params;

    await Goal.deleteOne({ _id: id, userId });
    await Task.deleteMany({ goalId: id, userId });

    return Response.json({ message: "Goal and associated tasks deleted" }, { status: 200 });
  } catch (error) {
    return handleApiError(error, "Goal Detail DELETE");
  }
}
