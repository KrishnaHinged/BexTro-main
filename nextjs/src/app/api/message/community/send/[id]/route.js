import connectDB from "@/lib/db";
import { Message } from "@/models/messageModel";
import Community from "@/models/Community";
import { Notification } from "@/models/Notification";
import { verifyAuth } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { userId: senderId } = await verifyAuth(req);
    const { id: communityId } = await params;
    const body = await req.json();
    const message = typeof body?.message === "string" ? body.message.trim() : "";

    if (!message || message.length === 0) {
      return Response.json({ message: "Message cannot be empty." }, { status: 400 });
    }
    if (message.length > 5000) {
      return Response.json({ message: "Message is too long (maximum 5000 characters)." }, { status: 400 });
    }

    const community = await Community.findById(communityId);
    const isMember = (community?.members || []).some(id => id.toString() === senderId.toString());
    if (!community || !isMember) {
      return Response.json({ message: "You must be a member of this community to chat here." }, { status: 403 });
    }

    const newMessage = await Message.create({
      senderId,
      communityId,
      message
    });

    const populatedMessage = await Message.findById(newMessage._id).populate("senderId", "fullName username profilePhoto");

    // Create notifications for other members
    try {
      const otherMembers = community.members.filter(m => m.toString() !== senderId.toString());
      const notifications = otherMembers.map(memberId => ({
        sender: senderId,
        receiver: memberId,
        type: "communityMessage",
        community: communityId
      }));
      
      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    } catch (error) {
      console.error("Error creating community notifications:", error.message);
    }

    return Response.json({ newMessage: populatedMessage, success: true }, { status: 201 });
  } catch (error) {
    console.error("Community Msg Error:", error);
    return Response.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
