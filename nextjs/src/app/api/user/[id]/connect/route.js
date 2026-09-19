import connectDB from "@/lib/db";
import { User } from "@/models/userModel";
import { verifyAuth } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { userId: currentUserId } = await verifyAuth(req);
    const { id: targetUserId } = await params;

    if (targetUserId === currentUserId) {
        return Response.json({ message: "You cannot send request to yourself" }, { status: 400 });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
        return Response.json({ message: "User not found" }, { status: 404 });
    }

    if (currentUser.connections.includes(targetUserId)) {
        return Response.json({ message: "Already connected" }, { status: 400 });
    }

    if (currentUser.sentRequests.includes(targetUserId)) {
        return Response.json({ message: "Request already sent" }, { status: 400 });
    }

    if (currentUser.receivedRequests.includes(targetUserId)) {
        return Response.json({ message: "You have a pending request from this user" }, { status: 400 });
    }

    currentUser.sentRequests.push(targetUserId);
    targetUser.receivedRequests.push(currentUserId);

    await currentUser.save();
    await targetUser.save();

    return Response.json({ message: "Connection request sent successfully" }, { status: 200 });

  } catch (error) {
    console.error("Send Connection Request Error:", error);
    return Response.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
