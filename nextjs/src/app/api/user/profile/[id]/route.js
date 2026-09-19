import connectDB from "@/lib/db";
import { User } from "@/models/userModel";
import { verifyAuth } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { userId: currentUserId } = await verifyAuth(req);
    const { id: userId } = await params;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    let connectionStatus = "none";
    if (currentUserId) {
        const currentUser = await User.findById(currentUserId);
        if (currentUser) {
            if ((currentUser.connections || []).some(id => id.toString() === userId.toString())) {
                connectionStatus = "connected";
            } else if ((currentUser.sentRequests || []).some(id => id.toString() === userId.toString())) {
                connectionStatus = "pending";
            } else if ((currentUser.receivedRequests || []).some(id => id.toString() === userId.toString())) {
                connectionStatus = "received";
            }
        }
    }

    const isFollowing = (user.followers || []).some(id => id.toString() === currentUserId.toString());
    const isConnected = (user.connections || []).some(id => id.toString() === currentUserId.toString());

    const isSelf = currentUserId && currentUserId.toString() === userId.toString();
    const shouldHideContent = user.isPrivate && !isConnected && !isSelf;

    return Response.json({
        user: shouldHideContent ? { 
            _id: user._id, 
            username: user.username, 
            fullName: user.fullName, 
            profilePhoto: user.profilePhoto,
            isPrivate: true 
        } : user,
        connectionStatus,
        isFollowing,
        isConnected,
        shouldHideContent,
        followersCount: user.followers.length,
        followingCount: user.following.length
    }, { status: 200 });

  } catch (error) {
    console.error("Get Profile By ID Error:", error);
    return Response.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
