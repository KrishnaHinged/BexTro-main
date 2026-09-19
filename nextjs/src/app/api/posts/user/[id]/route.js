import connectDB from "@/lib/db";
import { Post } from "@/models/Post";
import { User } from "@/models/userModel";
import { verifyAuth } from "@/lib/auth";


export async function GET(req, { params }) {
  try {
    await connectDB();
    const { userId: currentUserId } = await verifyAuth(req);
    const { id: userId } = await params;

    const currentUser = await User.findById(currentUserId);

    const posts = await Post.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate("user", "fullName username profilePhoto following isPrivate");

    const postsWithStatus = posts.map(post => {
        const p = post.toObject();
        const authorId = p.user._id.toString();
        
        let status = "none";
        if (authorId === currentUserId.toString()) {
            status = "self";
        } else if (currentUser) {
            const iFollow = (currentUser.following || []).some(id => id.toString() === authorId);
            const theyFollowMe = (p.user.following || []).some(id => id.toString() === currentUserId.toString());
            
            if (iFollow && theyFollowMe) status = "mutual";
            else if (iFollow) status = "following";
            else if (theyFollowMe) status = "followed_by";
        }
        
        p.authorConnectionStatus = status;
        delete p.user.following;
        return p;
    }).filter(post => {
        if (!post) return false;
        
        const isOwner = post.user._id.toString() === currentUserId.toString();
        
        if (post.visibility === "private" && !isOwner) return false;
        
        if (post.user.isPrivate && !isOwner) {
            const isConnected = (currentUser?.connections || []).some(id => id.toString() === post.user._id.toString());
            if (!isConnected) return false;
        }
        
        return true;
    });

    return Response.json(postsWithStatus, { status: 200 });

  } catch (error) {
    console.error("Get User Posts Error:", error);
    return Response.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
