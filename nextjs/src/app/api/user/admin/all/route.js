import connectDB from "@/lib/db";
import { User } from "@/models/userModel";
import { isAdminAuth } from "@/lib/auth";

export async function GET(req) {
  try {
    await isAdminAuth(req);
    await connectDB();

    const users = await User.find().select("-password").sort({ createdAt: -1 }).limit(100);
    return Response.json(users, { status: 200 });
  } catch (error) {
    const isAuth = error.message?.includes("denied") || error.message?.includes("token");
    if (!isAuth) console.error("Admin all users error:", error);
    const status = error.message?.includes("denied") ? 403 : (error.message?.includes("token") ? 401 : 500);
    return Response.json({ message: error.message || "Forbidden" }, { status });
  }
}
