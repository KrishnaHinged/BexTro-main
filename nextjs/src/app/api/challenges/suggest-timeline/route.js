import connectDB from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

let model = null;
try {
  if (process.env.GEMINI_API_KEY) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }
} catch (err) {
  console.error("Gemini failed to initialize for timeline:", err.message);
}

export async function POST(req) {
  try {
    await connectDB();
    await verifyAuth(req);
    const { challengeText } = await req.json();

    if (!challengeText) {
      return Response.json({ message: "Challenge text is required." }, { status: 400 });
    }

    if (!model) {
      const lowerText = challengeText.toLowerCase();
      let days = 3;
      if (lowerText.length < 20 || lowerText.includes("drink") || lowerText.includes("read a page")) days = 1;
      else if (lowerText.includes("marathon") || lowerText.includes("build a") || lowerText.length > 80) days = 7;
      return Response.json({ suggestedDays: days }, { status: 200 });
    }

    const prompt = `Analyze this challenge and suggest a realistic timeline in days to complete it. The challenge is: "${challengeText}". Respond with ONLY a single integer representing the number of days (e.g., 1, 3, or 7). Do not include any other text or characters.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text().trim();

    const match = textResponse.match(/\d+/);
    const suggestedDays = match ? parseInt(match[0], 10) : 3;

    return Response.json({ suggestedDays }, { status: 200 });
  } catch (error) {
    console.error("AI Timeline Suggestion Error:", error);
    return Response.json({ suggestedDays: 3, message: "Timeline fallback initialized." }, { status: 200 });
  }
}
