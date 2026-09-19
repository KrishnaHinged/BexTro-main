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

    const connections = await User.find({ 
        _id: { $in: currentUser.connections || [] }
    }).select("fullName username profilePhoto");

    return Response.json(connections, { status: 200 });

  } catch (error) {
    return handleApiError(error, "Get Connections");
  }
}
