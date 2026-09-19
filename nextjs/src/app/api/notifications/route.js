import connectDB from "@/lib/db";
import { Notification } from "@/models/Notification";
import { verifyAuth } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);

    const notifications = await Notification.find({ receiver: userId })
      .sort({ createdAt: -1 })
      .populate("sender", "fullName username profilePhoto")
      .populate("post", "challengeText")
      .limit(50);

    return Response.json(notifications, { status: 200 });
  } catch (error) {
    console.error("Get Notifications Error:", error);
    return Response.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
