import connectDB from "@/lib/db";
import { Message } from "@/models/messageModel";
import Community from "@/models/Community";
import { verifyAuth } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { userId: senderId } = await verifyAuth(req);
    const { id: communityId } = await params;

    const community = await Community.findById(communityId);
    const isMember = (community?.members || []).some(id => id.toString() === senderId.toString());
    if (!community || !isMember) {
      return Response.json({ message: "You must be a member to read this chat." }, { status: 403 });
    }

    const messages = await Message.find({ communityId })
      .populate("senderId", "fullName username profilePhoto")
      .sort({ createdAt: 1 })
      .limit(100);

    return Response.json(messages, { status: 200 });
  } catch (error) {
    console.error("Get Community Msg Error:", error);
    return Response.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
