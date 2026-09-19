import connectDB from "@/lib/db";
import { User } from "@/models/userModel";
import { verifyAuth, handleApiError } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectDB();
    const { userId: currentUserId } = await verifyAuth(req);

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    const receivedRequests = await User.find({ 
        _id: { $in: currentUser.receivedRequests || [] }
    }).select("fullName username profilePhoto");

    const sentRequests = await User.find({ 
        _id: { $in: currentUser.sentRequests || [] }
    }).select("fullName username profilePhoto");

    return Response.json({
        received: receivedRequests,
        sent: sentRequests
    }, { status: 200 });

  } catch (error) {
    return handleApiError(error, "Get Connection Requests");
  }
}
