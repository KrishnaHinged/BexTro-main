import connectDB from "@/lib/db";
import { User } from "@/models/userModel";
import { verifyAuth } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);

    const user = await User.findById(userId);
    if (!user) return Response.json({ message: "User not found" }, { status: 404 });

    user.stats.totalSkipped = (user.stats.totalSkipped || 0) + 1;
    await user.save();

    return Response.json({ message: "Challenge skipped!", success: true }, { status: 200 });
  } catch (error) {
    console.error("Skip Challenge Error:", error);
    return Response.json({ message: error.message || "Failed to skip challenge" }, { status: 500 });
  }
}
