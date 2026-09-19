import { GoogleGenerativeAI } from "@google/generative-ai";
import { verifyAuth } from "@/lib/auth";

export async function POST(req) {
  try {
    await verifyAuth(req);
    const body = await req.json();
    const { title, motivation, category = "Career", targetState } = body;

    let aiPlan = null;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey !== "YOUR_ACTUAL_GEMINI_API_KEY") {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
            responseMimeType: "application/json"
          }
        });

        const prompt = `You are a high-performance trajectory coach for the app BexTro.
Break down this user's goal into a realistic, structured execution roadmap:
Goal: "${title}"
Category: "${category}"
Motivation: "${motivation || "Personal growth and excellence"}"
Desired Outcome: "${targetState || "Full mastery and completion"}"

Respond ONLY with valid JSON in this exact structure:
{
  "startingState": "Current baseline definition",
  "targetState": "Measurable high-standard final milestone",
  "measurableMetrics": ["Metric 1", "Metric 2", "Metric 3"],
  "milestones": [
    { "title": "Phase 1: Foundation", "targetWeeks": 2 },
    { "title": "Phase 2: Core Build & Iteration", "targetWeeks": 4 },
    { "title": "Phase 3: Real-World Launch / Showcase", "targetWeeks": 8 }
  ],
  "weeklyTargets": ["Target week 1", "Target week 2", "Target week 3"],
  "starterDailyTasks": ["Task 1 (actionable today)", "Task 2", "Task 3"],
  "aiInsight": "1-2 sentence sharp strategic tip for staying disciplined."
}`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        if (responseText) {
          aiPlan = JSON.parse(responseText.trim());
        }
      } catch (geminiErr) {
        // Fallback engine activated silently
      }
    }

    if (!aiPlan) {
      // Deterministic high-quality smart fallback
      aiPlan = {
        startingState: body.startingState || "Foundational stage",
        targetState: targetState || title,
        measurableMetrics: [
          "Complete 3 strategic milestones",
          "Maintain weekly progress velocity > 80%",
          "Verify outcome with documented proof"
        ],
        milestones: [
          { title: "Phase 1: Architecture & Foundation", targetWeeks: 2 },
          { title: "Phase 2: Execution & Iteration", targetWeeks: 4 },
          { title: "Phase 3: Final Delivery & Mastery", targetWeeks: 8 }
        ],
        weeklyTargets: [
          "Week 1-2: Establish base habits and initial assets",
          "Week 3-4: Build core components and resolve primary roadblocks",
          "Week 5+: Solidify workflow and achieve measurable outcomes"
        ],
        starterDailyTasks: [
          `Review scope and milestones for '${title}'`,
          "Complete first 25-minute focused execution block",
          "Document initial progress and next blocker"
        ],
        aiInsight: `Break '${title}' down into daily 25-minute non-negotiable focus blocks to maintain consistent trajectory velocity.`
      };
    }

    return Response.json({ plan: aiPlan, aiPlan }, { status: 200 });
  } catch (error) {
    if (!error.message?.includes("token")) console.error("AI Plan Route Error:", error);
    const status = error.message?.includes("token") ? 401 : 500;
    return Response.json({ message: error.message || "Failed to generate AI plan" }, { status });
  }
}
