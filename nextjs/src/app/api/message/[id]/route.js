import connectDB from "@/lib/db";
import { Conversation } from "@/models/conversationModel";
import { User } from "@/models/userModel";
import Community from "@/models/Community";
import { verifyAuth } from "@/lib/auth";

async function canMessageDirectly(senderId, receiverId) {
  const sender = await User.findById(senderId);
  const receiver = await User.findById(receiverId);
  
  if (!sender || !receiver) return false;

  const isConnected = (sender.connections || []).some(id => id.toString() === receiverId.toString());
  if (isConnected) return true;

  const senderFollowsReceiver = (sender.following || []).some(id => id.toString() === receiverId.toString());
  const receiverFollowsSender = (receiver.following || []).some(id => id.toString() === senderId.toString());

  if (senderFollowsReceiver && receiverFollowsSender) {
    return true;
  }

  const sharedCommunity = await Community.findOne({
    members: { $all: [senderId, receiverId] }
  });

  if (sharedCommunity) {
    return true;
  }

  return false;
}

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { userId: senderId } = await verifyAuth(req);
    const { id: receiverId } = await params;

    const isAuthorized = await canMessageDirectly(senderId, receiverId);
    if (!isAuthorized) {
      return Response.json({ message: "You don't have permission to view this chat." }, { status: 403 });
    }

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    }).populate({
      path: "messages",
      populate: { path: "senderId", select: "fullName username profilePhoto" }
    });

    return Response.json(conversation?.messages || [], { status: 200 });
  } catch (error) {
    console.error("Get Message Error:", error);
    return Response.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
