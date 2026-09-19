import connectDB from "@/lib/db";
import { User } from "@/models/userModel";
import { verifyAuth } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);
    const { challengeText } = await req.json();

    if (!challengeText) return Response.json({ message: "Challenge text required." }, { status: 400 });

    const user = await User.findById(userId);
    if (!user) return Response.json({ message: "User not found" }, { status: 404 });

    const index = user.acceptedChallenges.findIndex(c => c.challengeText === challengeText);
    if (index === -1) return Response.json({ message: "Challenge not found" }, { status: 404 });

    user.acceptedChallenges.splice(index, 1);
    user.stats.totalCompleted = (user.stats.totalCompleted || 0) + 1;
    user.score = (user.score || 0) + 10;
    
    // Gamification & Core Loop XP Rewards
    user.totalXP = (user.totalXP || 0) + 10;
    
    await user.save();

    return Response.json({ message: "Challenge completed!", score: user.score, success: true }, { status: 200 });
  } catch (error) {
    console.error("Complete Challenge Error:", error);
    return Response.json({ message: error.message || "Failed to complete challenge" }, { status: 500 });
  }
}
