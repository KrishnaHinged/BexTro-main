import connectDB from "@/lib/db";
import { Post } from "@/models/Post";
import { User } from "@/models/userModel";
import Challenge from "@/models/Challenge";
import { verifyAuth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);

    const formData = await req.formData();
    const challengeText = formData.get("challengeText");
    const challengeId = formData.get("challengeId");
    const proofType = formData.get("proofType");
    const proofUrl = formData.get("proofUrl");
    const timelineTaken = formData.get("timelineTaken");
    const description = formData.get("description");
    const visibility = formData.get("visibility") || "public";

    if (!challengeText || !proofType || !timelineTaken) {
      return Response.json({ message: "Missing required fields: challengeText/proofType/timelineTaken." }, { status: 400 });
    }

    const allowedTypes = ["image", "video", "blog", "link"];
    if (!allowedTypes.includes(proofType)) {
      return Response.json({ message: "Invalid proofType." }, { status: 400 });
    }

    if (challengeText.length > 300) {
      return Response.json({ message: "Challenge text must be under 300 characters." }, { status: 400 });
    }

    if (description && description.length > 3000) {
      return Response.json({ message: "Description must be under 3000 characters." }, { status: 400 });
    }

    let finalProofUrl = proofUrl ? proofUrl.trim() : "";

    const file = formData.get("proofFile");
    if (proofType === "image" || proofType === "video") {
      if (!file && !proofUrl) {
        return Response.json({ message: "Proof file is required for image and video types." }, { status: 400 });
      }
      if (file && typeof file === "object" && file.name) {
        const { validateAndExtractUpload } = await import("@/lib/uploadSecurity");
        const { safeFilename, buffer } = await validateAndExtractUpload(file, "proofFile");

        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadsDir, { recursive: true });

        const filePath = path.join(uploadsDir, safeFilename);
        await writeFile(filePath, buffer);
        finalProofUrl = `/uploads/${safeFilename}`;
      }
    } else if (proofType === "blog" || proofType === "link") {
      if (!finalProofUrl || !/^https?:\/\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+$/i.test(finalProofUrl)) {
        return Response.json({ message: `Valid http/https URL is required for proofType ${proofType}.` }, { status: 400 });
      }
    }

    if (!finalProofUrl) {
      return Response.json({ message: "Proof URL or uploaded file is required." }, { status: 400 });
    }

    const newPost = await Post.create({
      user: userId,
      challengeText,
      challengeId: challengeId || null,
      proofType,
      proofUrl: finalProofUrl,
      description: description ? description.trim() : "",
      timelineTaken: Number(timelineTaken),
      visibility,
    });

    const user = await User.findById(userId);
    let rewards = {};
    if (user) {
      const challengeIndex = user.acceptedChallenges.findIndex(
        (c) => c.challengeText === challengeText && c.status === "active"
      );

      if (challengeIndex !== -1) {
        user.acceptedChallenges[challengeIndex].status = "completed";
        user.acceptedChallenges[challengeIndex].proofPostId = newPost._id;
      } else {
        user.acceptedChallenges.push({
          challengeText,
          status: "completed",
          timelineDays: Number(timelineTaken),
          proofPostId: newPost._id
        });
      }

      user.stats.totalCompleted = (user.stats.totalCompleted || 0) + 1;

      // Gamification & Core Loop
      let xpGained = 25;
      if (challengeId) {
        try {
          const challenge = await Challenge.findById(challengeId);
          if (challenge) {
            if (challenge.difficulty === "Easy") xpGained = 10;
            else if (challenge.difficulty === "Hard") xpGained = 50;
          }
        } catch (e) {
          // ignore challenge fetch error
        }
      }

      user.totalXP = (user.totalXP || 0) + xpGained;
      user.score = (user.score || 0) + xpGained;
      user.level = Math.floor(user.totalXP / 100) || 1;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (!user.lastActiveDate) {
        user.currentStreak = 1;
      } else {
        const lastActive = new Date(user.lastActiveDate);
        lastActive.setHours(0, 0, 0, 0);

        const diffTime = today - lastActive;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        if (diffDays === 1) {
          user.currentStreak += 1;
        } else if (diffDays > 1) {
          user.currentStreak = 1;
        }
      }

      user.longestStreak = Math.max(user.longestStreak || 0, user.currentStreak);
      user.lastActiveDate = new Date();

      const newBadges = [];
      if (user.stats.totalCompleted === 1 && !user.badges.includes("First Step")) {
        newBadges.push("First Step");
      }
      if (user.currentStreak === 7 && !user.badges.includes("Week Warrior")) {
        newBadges.push("Week Warrior");
      }
      if (user.stats.totalCompleted === 10 && !user.badges.includes("Consistency King")) {
        newBadges.push("Consistency King");
      }

      if (newBadges.length > 0) {
        user.badges = [...user.badges, ...newBadges];
      }

      await user.save();

      rewards = {
        xpGained,
        currentStreak: user.currentStreak,
        level: user.level,
        newBadges
      };
    }

    return Response.json({
      message: "Proof uploaded successfully",
      post: newPost,
      rewards
    }, { status: 201 });

  } catch (error) {
    console.error("Create Post Route Error:", error);
    return Response.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
