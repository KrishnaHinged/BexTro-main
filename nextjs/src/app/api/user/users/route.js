import connectDB from "@/lib/db";
import { User } from "@/models/userModel";
import { verifyAuth } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    const connectedUsers = await User.find({ 
      _id: { $in: currentUser.connections || [] }
    }).select("-password");

    return Response.json(connectedUsers, { status: 200 });
  } catch (error) {
    console.error("Get Other Users Error:", error);
    return Response.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
