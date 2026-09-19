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
    const { challenge, timelineDays } = await req.json();

    if (!challenge || typeof challenge !== "string") {
      return Response.json({ message: "Valid challenge text required." }, { status: 400 });
    }
    if (filter.check(challenge)) {
      return Response.json({ message: "Inappropriate challenge content." }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) return Response.json({ message: "User not found" }, { status: 404 });

    const acceptedItem = {
      challengeText: challenge,
      acceptedAt: new Date(),
      status: "active",
      timelineDays: timelineDays ? Number(timelineDays) : 1
    };

    user.acceptedChallenges.push(acceptedItem);
    user.stats.totalAccepted = (user.stats.totalAccepted || 0) + 1;
    await user.save();

    return Response.json({ message: "Challenge accepted and saved!", success: true }, { status: 200 });
  } catch (error) {
    console.error("Accept Challenge Error:", error);
    return Response.json({ message: error.message || "Failed to accept challenge" }, { status: 500 });
  }
}
