import connectDB from "@/lib/db";
import { Conversation } from "@/models/conversationModel";
import { Message } from "@/models/messageModel";
import { User } from "@/models/userModel";
import Community from "@/models/Community";
import { Notification } from "@/models/Notification";
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

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { userId: senderId } = await verifyAuth(req);
    const { id: receiverId } = await params;
    const body = await req.json();
    const message = typeof body?.message === "string" ? body.message.trim() : "";

    if (!message || message.length === 0) {
      return Response.json({ message: "Message cannot be empty." }, { status: 400 });
    }

    if (message.length > 5000) {
      return Response.json({ message: "Message is too long (maximum 5000 characters)." }, { status: 400 });
    }

    const isAuthorized = await canMessageDirectly(senderId, receiverId);
    if (!isAuthorized) {
      return Response.json({ message: "You must be connected or share a community to message this user." }, { status: 403 });
    }

    let gotConversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!gotConversation) {
      gotConversation = await Conversation.create({
        participants: [senderId, receiverId]
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message
    });

    if (newMessage) {
      gotConversation.messages.push(newMessage._id);
    }

    await Promise.all([gotConversation.save(), newMessage.save()]);

    const populatedMessage = await Message.findById(newMessage._id).populate("senderId", "fullName username profilePhoto");

    // Create notification for new message
    try {
      await Notification.create({
        sender: senderId,
        receiver: receiverId,
        type: "message",
      });
    } catch (error) {
      console.error("Error creating chat notification:", error.message);
    }

    return Response.json({ newMessage: populatedMessage, success: true }, { status: 201 });
  } catch (error) {
    console.error("Send Message Error:", error);
    return Response.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
