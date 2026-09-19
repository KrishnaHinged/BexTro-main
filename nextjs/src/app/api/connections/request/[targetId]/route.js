import connectDB from "@/lib/db";
import { User } from "@/models/userModel";
import { verifyAuth } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);
    const { targetId } = await params;

    if (userId === targetId) return Response.json({ message: "You can't connect with yourself" }, { status: 400 });

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetId);

    if (!targetUser) return Response.json({ message: "Target user not found" }, { status: 404 });

    if ((user.connections || []).some(id => id.toString() === targetId.toString())) {
      return Response.json({ message: "Already connected" }, { status: 400 });
    }
    if ((user.sentRequests || []).some(id => id.toString() === targetId.toString())) {
      return Response.json({ message: "Request already sent" }, { status: 400 });
    }

    user.sentRequests.push(targetId);
    targetUser.receivedRequests.push(userId);

    await user.save();
    await targetUser.save();

    return Response.json({ message: "Connection request sent successfully", success: true }, { status: 200 });
  } catch (error) {
    console.error("Connection Request Error:", error);
    return Response.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
