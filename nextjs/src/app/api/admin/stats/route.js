import connectDB from "@/lib/db";
import { User } from "@/models/userModel";
import { Post } from "@/models/Post";
import { Goal } from "@/models/Goal";
import { Report } from "@/models/Report";
import { isAdminAuth } from "@/lib/auth";

export async function GET(req) {
  try {
    await isAdminAuth(req);
    await connectDB();

    const [users, posts, totalGoals, pendingReports] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Goal.countDocuments(),
      Report.countDocuments({ status: "pending" })
    ]);

    return Response.json({
      users,
      posts,
      totalGoals,
      completedTasks: 0,
      pendingReports
    }, { status: 200 });
  } catch (error) {
    const isAuth = error.message?.includes("denied") || error.message?.includes("token");
    if (!isAuth) console.error("Admin stats error:", error);
    const status = error.message?.includes("denied") ? 403 : (error.message?.includes("token") ? 401 : 500);
    return Response.json({ message: error.message || "Forbidden" }, { status });
  }
}
