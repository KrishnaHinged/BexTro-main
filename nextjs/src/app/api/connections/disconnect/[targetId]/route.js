import connectDB from "@/lib/db";
import { User } from "@/models/userModel";
import { verifyAuth } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);
    const { targetId } = await params;

    await User.findByIdAndUpdate(userId, {
      $pull: { connections: targetId, following: targetId, followers: targetId }
    });

    await User.findByIdAndUpdate(targetId, {
      $pull: { connections: userId, following: userId, followers: userId }
    });

    return Response.json({ message: "Disconnected successfully", success: true }, { status: 200 });
  } catch (error) {
    console.error("Disconnect Connection Error:", error);
    return Response.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
