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

    if (!user.receivedRequests.includes(requesterId)) {
      return Response.json({ message: "No pending request from this user" }, { status: 400 });
    }

    user.receivedRequests = user.receivedRequests.filter(id => id.toString() !== requesterId);
    user.connections.push(requesterId);

    if (!user.followers.includes(requesterId)) user.followers.push(requesterId);
    if (!user.following.includes(requesterId)) user.following.push(requesterId);

    requester.sentRequests = requester.sentRequests.filter(id => id.toString() !== userId);
    requester.connections.push(userId);
    if (!requester.followers.includes(userId)) requester.followers.push(userId);
    if (!requester.following.includes(userId)) requester.following.push(userId);

    await user.save();
    await requester.save();

    return Response.json({ message: "Request accepted. You are now connected!", success: true }, { status: 200 });
  } catch (error) {
    console.error("Accept Connection Error:", error);
    return Response.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
