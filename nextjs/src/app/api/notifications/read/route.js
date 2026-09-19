import connectDB from "@/lib/db";
import { Notification } from "@/models/Notification";
import { verifyAuth } from "@/lib/auth";

export async function PUT(req) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);

    await Notification.updateMany({ receiver: userId, isRead: false }, { $set: { isRead: true } });

    return Response.json({ message: "Notifications marked as read", success: true }, { status: 200 });
  } catch (error) {
    console.error("Mark notifications read Error:", error);
    return Response.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
