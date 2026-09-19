import connectDB from "@/lib/db";
import { User } from "@/models/userModel";
import { verifyAuth } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { userId: currentUserId } = await verifyAuth(req);
    const { id: targetUserId } = await params;

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
        return Response.json({ message: "User not found" }, { status: 404 });
    }

    const hasRequest = (currentUser.receivedRequests || []).some(id => id.toString() === targetUserId.toString());
    if (!hasRequest) {
        return Response.json({ message: "No pending request from this user" }, { status: 400 });
    }

    currentUser.receivedRequests = (currentUser.receivedRequests || []).filter(id => id.toString() !== targetUserId.toString());
    targetUser.sentRequests = (targetUser.sentRequests || []).filter(id => id.toString() !== currentUserId.toString());

    await currentUser.save();
    await targetUser.save();

    return Response.json({ message: "Connection request rejected" }, { status: 200 });

  } catch (error) {
    console.error("Reject Connection Request Error:", error);
    return Response.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
