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

    if (!currentUser.receivedRequests.includes(targetUserId)) {
        return Response.json({ message: "No pending request from this user" }, { status: 400 });
    }

    currentUser.receivedRequests = currentUser.receivedRequests.filter(id => id.toString() !== targetUserId);
    targetUser.sentRequests = targetUser.sentRequests.filter(id => id.toString() !== currentUserId);

    currentUser.connections.push(targetUserId);
    targetUser.connections.push(currentUserId);

    await currentUser.save();
    await targetUser.save();

    return Response.json({ message: "Connection request accepted" }, { status: 200 });

  } catch (error) {
    console.error("Accept Connection Request Error:", error);
    return Response.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
