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

    user.receivedRequests = user.receivedRequests.filter(id => id.toString() !== requesterId);
    if (requester) {
      requester.sentRequests = requester.sentRequests.filter(id => id.toString() !== userId);
      await requester.save();
    }

    await user.save();

    return Response.json({ message: "Request rejected", success: true }, { status: 200 });
  } catch (error) {
    console.error("Reject Connection Error:", error);
    return Response.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
