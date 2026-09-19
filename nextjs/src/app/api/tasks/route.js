import connectDB from "@/lib/db";
import { Task } from "@/models/Task";
import { verifyAuth } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);

    const url = new URL(req.url);
    const goalId = url.searchParams.get("goalId");
    const status = url.searchParams.get("status");

    const query = { userId };
    if (goalId) query.goalId = goalId;
    if (status) query.status = status;

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    return Response.json({ tasks: tasks || [] }, { status: 200 });
  } catch (error) {
    console.error("Tasks GET Route Error:", error);
    return Response.json({ tasks: [], message: error.message }, { status: 200 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);
    const body = await req.json();

    if (!body.title) {
      return Response.json({ message: "Task title is required" }, { status: 400 });
    }

    const task = await Task.create({
      userId,
      goalId: body.goalId || null,
      title: body.title,
      category: body.category || "Personal",
      timeBlockMinutes: body.timeBlockMinutes || 30,
      status: "pending"
    });

    return Response.json({ task, message: "Task added successfully" }, { status: 201 });
  } catch (error) {
    console.error("Tasks POST Route Error:", error);
    return Response.json({ message: error.message || "Failed to create task" }, { status: 500 });
  }
}
