import connectDB from "@/lib/db";
import { User } from "@/models/userModel";
import { verifyAuth } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSuggestionsForInterests } from "@/utils/bucketListSuggestions";

export async function POST(req) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);

    const user = await User.findById(userId).lean();
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const requestInterests = Array.isArray(body.interests) ? body.interests : null;

    // Use interests passed in request, or user profile interests
    const userInterests = (requestInterests && requestInterests.length > 0)
      ? requestInterests
      : (user.interests || []);

    const existingGoals = (user.bucketList || []).map((i) => i.text).filter(Boolean);

    // Try Live Google Gemini first
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 10) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          generationConfig: {
            temperature: 0.85,
            maxOutputTokens: 1000,
            responseMimeType: "application/json",
          },
        });

        const prompt = `You are a personalized vision coach for Bextro.
Generate 6 to 9 exciting, specific, personalized dream bucket list goals for this specific user.

User Interests & Focus Areas: ${userInterests.join(", ") || "General Personal Growth & Exploration"}
Existing Goals Already in their Bucket List: ${existingGoals.slice(0, 10).join(", ") || "None"}

Rules:
1. Every goal must be tailored specifically to the user's focus areas.
2. Goals should be ambitious yet tangible life accomplishments.
3. Assign a matching categoryKey, a categoryLabel, and an iconName from this exact list: ["Code2", "Palette", "Music", "Trophy", "Compass", "Dumbbell", "PenTool", "TrendingUp", "Brain", "Target"].
4. Output MUST be ONLY a valid JSON array of objects.

JSON format:
[
  {
    "text": "Specific goal description",
    "categoryKey": "coding",
    "categoryLabel": "Coding & Tech",
    "iconName": "Code2"
  }
]`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const aiSuggestions = JSON.parse(text);

        if (Array.isArray(aiSuggestions) && aiSuggestions.length > 0) {
          return Response.json({
            suggestions: aiSuggestions,
            source: "gemini-ai",
            message: "Personalized bucket list crafted by AI"
          }, { status: 200 });
        }
      } catch (geminiError) {
        // Dynamic interest-engine fallback activated
      }
    }

    // Dynamic Interest-Engine Fallback (matched strictly to this user's interests)
    const categorized = getSuggestionsForInterests(userInterests);
    const existingLower = new Set(existingGoals.map((g) => g.toLowerCase().trim()));
    const dynamicSuggestions = [];

    categorized.forEach((cat) => {
      // Filter out goals the user already added, then shuffle to provide novel ideas on each refresh
      const available = (cat.items || []).filter((itemText) => !existingLower.has(itemText.toLowerCase().trim()));
      const pool = available.length > 0 ? available : (cat.items || []);
      const shuffled = [...pool].sort(() => Math.random() - 0.5);

      shuffled.slice(0, 3).forEach((itemText) => {
        dynamicSuggestions.push({
          text: itemText,
          categoryKey: cat.categoryKey,
          categoryLabel: cat.categoryLabel,
          iconName: cat.iconName
        });
      });
    });

    // Shuffle the final list so categories are pleasantly intermingled
    const randomizedList = dynamicSuggestions.sort(() => Math.random() - 0.5);

    return Response.json({
      suggestions: randomizedList,
      source: "interest-engine",
      message: "Personalized suggestions tailored to your interests"
    }, { status: 200 });
  } catch (error) {
    console.error("Bucket List Suggestion API Error:", error);
    return Response.json({ error: error.message || "Failed to generate suggestions" }, { status: 500 });
  }
}

export async function GET(req) {
  return POST(req);
}
