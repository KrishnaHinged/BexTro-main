import connectDB from "@/lib/db";
import { User } from "@/models/userModel";
import { verifyAuth } from "@/lib/auth";
import leoProfanity from "leo-profanity";

const filter = leoProfanity;
filter.add(["porn", "kill", "drugs", "violence"]);

export async function POST(req) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);
    const { challengeText } = await req.json();

    if (!challengeText || typeof challengeText !== "string") {
      return Response.json({ message: "Challenge text is required." }, { status: 400 });
    }
    if (filter.check(challengeText)) {
      return Response.json({ message: "Inappropriate challenge content." }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) return Response.json({ message: "User not found" }, { status: 404 });

    user.acceptedChallenges.push({ challengeText, acceptedAt: new Date() });
    user.stats.totalCustomChallenges = (user.stats.totalCustomChallenges || 0) + 1;
    await user.save();

    return Response.json({ message: "Custom challenge added successfully!", success: true }, { status: 200 });
  } catch (error) {
    console.error("Create Custom Challenge Error:", error);
    return Response.json({ message: error.message || "Failed to create custom challenge" }, { status: 500 });
  }
}
