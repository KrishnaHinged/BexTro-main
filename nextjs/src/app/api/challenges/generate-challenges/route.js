import connectDB from "@/lib/db";
import { User } from "@/models/userModel";
import Challenge from "@/models/Challenge";
import { verifyAuth } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import leoProfanity from "leo-profanity";

const filter = leoProfanity;
filter.add(["porn", "kill", "drugs", "violence"]);

let model = null;
try {
  if (process.env.GEMINI_API_KEY) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 1000,
        responseMimeType: "application/json",
      },
    });
  }
} catch (err) {
  console.error("Gemini failed to initialize:", err.message);
}

export async function GET(req) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);

    const user = await User.findById(userId).lean();
    if (!user) return Response.json({ message: "User not found" }, { status: 404 });

    const interests = (user.interests || []).filter(Boolean);
    const bucketList = (user.bucketList || []).map(i => i.text).filter(Boolean);
    const keywords = [...new Set([...interests, ...bucketList])].filter(k => typeof k === 'string' && k.trim().length > 0);

    if (keywords.length === 0) {
      return Response.json({ error: "Add interests or bucket list items first!" }, { status: 400 });
    }

    let challenges = [];

    // Try Gemini
    if (model) {
      try {
        const prompt = `You are a motivational coach. Generate exactly 4 short, exciting, and achievable challenges based ONLY on these user interests and goals:

Interests & Bucket List: ${keywords.join(", ")}

Return ONLY valid JSON (no markdown, no extra text):

[{"text":"Challenge title (50-90 chars)","objective":"What to do","motivation":"Why it matters to them","benefits":["Benefit 1","Benefit 2","Benefit 3"]}]
`;

        const result = await model.generateContent(prompt);
        const rawText = result.response?.text?.()?.trim() || "";

        if (rawText) {
          const parsed = JSON.parse(rawText);
          if (Array.isArray(parsed) && parsed.length > 0) {
            challenges = parsed;
          }
        }
      } catch (geminiErr) {
        console.warn("Gemini failed, using fallback:", geminiErr.message);
      }
    }

    // Fallback templates
    if (challenges.length < 4) {
      const fallbackTemplates = [
        { text: `Spend 15 minutes learning about ${keywords[0]} today`, objective: "Expand knowledge", motivation: "You're passionate about this", benefits: ["Growth", "Curiosity", "Confidence"] },
        { text: `Do one small action toward "${keywords[keywords.length > 1 ? 1 : 0]}" this week`, objective: "Build momentum", motivation: "Your bucket list is calling", benefits: ["Progress", "Excitement", "Pride"] },
        { text: `Teach someone what you know about ${keywords[0] || "your passion"}`, objective: "Share value", motivation: "Teaching deepens mastery", benefits: ["Connection", "Respect", "Clarity"] },
        { text: `Find and save one inspiring ${keywords[0] || "idea"} resource`, objective: "Curate inspiration", motivation: "Fuel your journey", benefits: ["Motivation", "Direction day"] },
        { text: `Take a photo related to ${keywords[0] || "your dream"} and set it as wallpaper`, objective: "Stay reminded", motivation: "Visual cues change behavior", benefits: ["Focus", "Daily motivation"] },
        { text: `Message someone who shares your interest in ${keywords[0] || "growth"}`, objective: "Build community", motivation: "You're not alone", benefits: ["Support", "Ideas", "Friendship"] },
        { text: `Set a 7-day micro-goal for ${keywords[0] || "your passion"}`, objective: "Create habit", motivation: "Small wins compound", benefits: ["Discipline", "Confidence", "Results"] },
        { text: `Remove one thing blocking your ${keywords[0] || "goal"} progress`, objective: "Clear the path", motivation: "Less friction = more action", benefits: ["Clarity", "Freedom", "Speed"] }
      ];

      challenges = fallbackTemplates
        .filter(t => keywords.some(k => t.text.toLowerCase().includes(k.toLowerCase())))
        .sort(() => Math.random() - 0.5)
        .concat(fallbackTemplates.sort(() => Math.random() - 0.5))
        .slice(0, 4);
    }

    const finalChallenges = challenges
      .filter(c => c?.text && c.text.length > 20 && c.text.length < 150)
      .filter(c => !filter.check(c.text))
      .slice(0, 4)
      .map(c => ({
        text: c.text.trim(),
        objective: c.objective || "Take action",
        motivation: c.motivation || "This moves you forward",
        benefits: Array.isArray(c.benefits) ? c.benefits : ["Growth", "Joy"]
      }));

    // Save generated challenges
    await Promise.all(
      finalChallenges.map(ch =>
        Challenge.create({
          ...ch,
          createdFromInterests: keywords,
          source: "AI"
        })
      )
    );

    return Response.json({ challenges: finalChallenges }, { status: 200 });

  } catch (error) {
    console.error("Generate Challenges Route Error:", error);
    // Bulletproof hard fallback
    return Response.json({
      challenges: [
        { text: `Take one tiny step toward growth today`, objective: "Start now", motivation: "You've been waiting long enough", benefits: ["Momentum", "Pride"] },
        { text: `Spend 10 minutes researching your goals`, objective: "Learn more", motivation: "Knowledge is power", benefits: ["Clarity", "Confidence"] },
        { text: `Tell one person about your interest in scaling skills`, objective: "Share your fire", motivation: "Speaking it makes it real", benefits: ["Accountability", "Connection"] },
        { text: `Do something today that future you will thank you for`, objective: "Build your future", motivation: "You're worth it", benefits: ["Peace", "Growth"] }
      ]
    }, { status: 200 });
  }
}
