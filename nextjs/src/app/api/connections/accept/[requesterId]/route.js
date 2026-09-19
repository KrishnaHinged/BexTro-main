import connectDB from "@/lib/db";
import { User } from "@/models/userModel";
import { verifyAuth } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);
    const { requesterId } = await params;

    const user = await User.findById(userId);
    const requester = await User.findById(requesterId);

    const hasRequest = (user.receivedRequests || []).some(id => id.toString() === requesterId.toString());
    if (!hasRequest) {
      return Response.json({ message: "No pending request from this user" }, { status: 400 });
    }

    user.receivedRequests = (user.receivedRequests || []).filter(id => id.toString() !== requesterId.toString());
    if (!user.connections.some(id => id.toString() === requesterId.toString())) {
      user.connections.push(requesterId);
    }

    if (!user.followers.some(id => id.toString() === requesterId.toString())) user.followers.push(requesterId);
    if (!user.following.some(id => id.toString() === requesterId.toString())) user.following.push(requesterId);

    requester.sentRequests = (requester.sentRequests || []).filter(id => id.toString() !== userId.toString());
    if (!requester.connections.some(id => id.toString() === userId.toString())) {
      requester.connections.push(userId);
    }
    if (!requester.followers.some(id => id.toString() === userId.toString())) requester.followers.push(userId);
    if (!requester.following.some(id => id.toString() === userId.toString())) requester.following.push(userId);

    await user.save();
    await requester.save();

    return Response.json({ message: "Request accepted. You are now connected!", success: true }, { status: 200 });
  } catch (error) {
    console.error("Accept Connection Error:", error);
    return Response.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
