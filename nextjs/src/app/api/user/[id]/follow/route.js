import connectDB from "@/lib/db";
import { User } from "@/models/userModel";
import { Notification } from "@/models/Notification";
import { verifyAuth } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { userId: currentUserId } = await verifyAuth(req);
    const { id: targetUserId } = await params;

    if (targetUserId === currentUserId) {
        return Response.json({ message: "You cannot follow yourself" }, { status: 400 });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
        return Response.json({ message: "User not found" }, { status: 404 });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
        currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId.toString());
        targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId.toString());
    } else {
        currentUser.following.push(targetUserId);
        targetUser.followers.push(currentUserId);
    }

    await currentUser.save();
    await targetUser.save();

    if (!isFollowing) {
        try {
            await Notification.create({
                sender: currentUserId,
                receiver: targetUserId,
                type: "follow",
            });
        } catch (err) {
            console.error("Error creating follow notification:", err.message);
        }
    }

    return Response.json({ 
        message: isFollowing ? "Unfollowed successfully" : "Followed successfully", 
        isFollowing: !isFollowing 
    }, { status: 200 });

  } catch (error) {
    console.error("Toggle Follow Error:", error);
    return Response.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
