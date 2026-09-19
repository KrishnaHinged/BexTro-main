import connectDB from "@/lib/db";
import { Post } from "@/models/Post";
import { User } from "@/models/userModel";
import Challenge from "@/models/Challenge";
import { verifyAuth } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);

    const { searchParams } = new URL(req.url);
    const tab = searchParams.get("tab"); // 'following' or 'foryou'

    const user = await User.findById(userId);
    if (!user) return Response.json({ message: "User not found" }, { status: 404 });

    let posts = [];
    if (tab === "following") {
      const followingIds = user.following || [];
      posts = await Post.find({
        user: { $in: [...followingIds, userId] },
        $or: [
          { visibility: "public" },
          { user: userId }
        ]
      })
        .sort({ createdAt: -1 })
        .populate("user", "fullName username profilePhoto following isPrivate")
        .limit(50);
    } else {
      // For You Logic: Personalization + Discovery
      let candidatePosts = await Post.find({
        $or: [
          { visibility: "public" },
          { user: userId }
        ]
      })
        .sort({ createdAt: -1 })
        .populate("user", "fullName username profilePhoto following isPrivate connections")
        .limit(200);

      if (candidatePosts.length < 10) {
        const interests = (user.interests || []).map(i => i.toLowerCase());

        const challenges = await Challenge.find({
          $or: [
            { category: { $in: user.interests || [] } },
            { createdFromInterests: { $in: user.interests || [] } }
          ]
        }).limit(20);

        const finalChallenges = challenges.length > 0 ? challenges : await Challenge.find().limit(20);

        const mockPosts = finalChallenges.map(ch => ({
          _id: ch._id,
          challengeText: ch.text,
          description: ch.difficulty + " Challenge: " + (ch.objective || ""),
          proofType: "link",
          proofUrl: "/challenges",
          isChallengeDiscovery: true,
          user: {
            _id: "000000000000000000000000",
            username: "Bextro Discovery",
            fullName: "Bextro AI",
            profilePhoto: "https://cdn-icons-png.flaticon.com/512/2103/2103633.png"
          },
          likes: [],
          comments: [],
          createdAt: ch.addedAt || new Date()
        }));

        candidatePosts = [...candidatePosts, ...mockPosts];
      }

      const interests = (user.interests || []).map(i => i.toLowerCase());
      const bucketListItems = (user.bucketList || []).map(b => b.text.toLowerCase());
      const allKeywords = [...new Set([...interests, ...bucketListItems])];

      const scoredPosts = candidatePosts.map(post => {
        let score = 0;
        const challengeText = (post.challengeText || "").toLowerCase();
        const description = (post.description || "").toLowerCase();

        allKeywords.forEach(keyword => {
          if (challengeText.includes(keyword) || description.includes(keyword)) {
            const isBucketList = bucketListItems.includes(keyword);
            score += isBucketList ? 40 : 30;
          }
        });

        score += (post.likes.length * 5);
        score += (post.comments.length * 10);

        const authorId = post.user?._id?.toString();
        const isFollowingAuthor = authorId && (user.following || []).some(id => id.toString() === authorId);
        if (isFollowingAuthor) score += 20;

        return { post, score };
      });

      posts = scoredPosts
        .sort((a, b) => b.score - a.score)
        .slice(0, 50)
        .map(item => item.post);
    }

    const postsWithStatus = posts.map(post => {
      const p = post.toObject ? post.toObject() : post;
      if (!p.user) return null;

      const authorId = p.user._id.toString();

      let status = "none";
      if (authorId === userId.toString()) {
        status = "self";
      } else {
        const iFollow = (user.following || []).some(id => id.toString() === authorId);
        const theyFollowMe = (p.user.following || []).some(id => id.toString() === userId.toString());

        if (iFollow && theyFollowMe) status = "mutual";
        else if (iFollow) status = "following";
        else if (theyFollowMe) status = "followed_by";
      }

      p.authorConnectionStatus = status;
      delete p.user.following;
      return p;
    }).filter(Boolean);

    return Response.json(postsWithStatus, { status: 200 });

  } catch (error) {
    console.error("Get Feed Route Error:", error);
    return Response.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
