import connectDB from "@/lib/db";
import { User } from "@/models/userModel";
import { Task } from "@/models/Task";
import { Goal } from "@/models/Goal";
import { verifyAuth } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);

    const user = await User.findById(userId).select("-password");
    const [tasks, goals] = await Promise.all([
      Task.find({ userId }),
      Goal.find({ userId })
    ]);

    const completedTasks = tasks.filter(t => t.status === "completed").length;
    const totalMinutes = tasks
      .filter(t => t.status === "completed")
      .reduce((acc, t) => acc + (t.timeBlockMinutes || 30), 0);

    const twinStats = {
      growthLevel: Math.max(1, Math.floor(completedTasks / 5) + 1),
      totalFocusMinutes: totalMinutes,
      completedActions: completedTasks,
      activeTrajectories: goals.filter(g => g.status === "active").length,
      completionRate: tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 100,
      insights: [
        `You have accumulated ${totalMinutes} deep focus minutes on your trajectory.`,
        "Sessions structured under 40 minutes maintain the highest follow-through rate.",
        "Consistent execution on primary goals doubles milestone achievement speed."
      ]
    };

    return Response.json({ profile: user, twinStats }, { status: 200 });
  } catch (error) {
    const isAuth = error.message?.includes("token");
    if (!isAuth) console.error("Growth Profile GET Error:", error);
    return Response.json({ profile: null, twinStats: null, message: error.message }, { status: 200 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);
    const body = await req.json();

    await User.findByIdAndUpdate(userId, {
      $set: {
        "stats.growthProfileUpdated": new Date(),
        ...(body.interests ? { interests: body.interests } : {})
      }
    });

    return Response.json({ success: true, message: "Growth profile updated" }, { status: 200 });
  } catch (error) {
    const isAuth = error.message?.includes("token");
    if (!isAuth) console.error("Growth Profile POST Error:", error);
    return Response.json({ message: error.message || "Failed to update" }, { status: isAuth ? 401 : 500 });
  }
}
