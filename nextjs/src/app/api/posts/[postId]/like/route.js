import connectDB from "@/lib/db";
import { Post } from "@/models/Post";
import { Notification } from "@/models/Notification";
import { verifyAuth } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);
    
    // In Next.js App Router, dynamic route params must be awaited!
    const { postId } = await params;

    const post = await Post.findById(postId);
    if (!post) return Response.json({ message: "Post not found" }, { status: 404 });

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
    }

    await post.save();

    const authorId = post.user.toString();

    // Create notification if not self-like
    if (!isLiked && authorId !== userId.toString()) {
      await Notification.create({
        sender: userId,
        receiver: authorId,
        type: "like",
        post: postId
      });
    }

    return Response.json({ message: isLiked ? "Post unliked" : "Post liked", likes: post.likes, success: true }, { status: 200 });
  } catch (error) {
    console.error("Toggle Like Error:", error);
    return Response.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
