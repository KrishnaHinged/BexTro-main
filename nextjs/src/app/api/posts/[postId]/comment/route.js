import connectDB from "@/lib/db";
import { Post } from "@/models/Post";
import { Notification } from "@/models/Notification";
import { verifyAuth } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);
    const { postId } = await params;
    const { text } = await req.json();

    if (!text || text.trim() === "") {
      return Response.json({ message: "Comment cannot be empty" }, { status: 400 });
    }

    const post = await Post.findById(postId);
    if (!post) return Response.json({ message: "Post not found" }, { status: 404 });

    const comment = { user: userId, text };
    post.comments.push(comment);
    await post.save();

    const populatedPost = await Post.findById(postId).populate("comments.user", "fullName username profilePhoto");

    const authorId = post.user.toString();
    if (authorId !== userId.toString()) {
      await Notification.create({
        sender: userId,
        receiver: authorId,
        type: "comment",
        post: postId
      });
    }

    return Response.json({ message: "Comment added", comments: populatedPost.comments, success: true }, { status: 200 });
  } catch (error) {
    console.error("Add Comment Error:", error);
    return Response.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
