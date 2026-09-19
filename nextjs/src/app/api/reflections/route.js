import connectDB from "@/lib/db";
import { Reflection } from "@/models/Reflection";
import { verifyAuth } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);

    const reflections = await Reflection.find({ userId }).sort({ createdAt: -1 }).limit(30);

    return Response.json({ reflections: reflections || [] }, { status: 200 });
  } catch (error) {
    const isAuthError = error.message?.includes("token");
    if (!isAuthError) console.error("Reflections GET Error:", error);
    return Response.json({ reflections: [], message: error.message }, { status: isAuthError ? 401 : 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);
    const body = await req.json();

    if (!body.content) {
      return Response.json({ message: "Content is required" }, { status: 400 });
    }

    const reflection = await Reflection.create({
      userId,
      content: body.content,
      mood: body.mood || "Focused",
      insight: body.insight || "",
      category: body.category || "General"
    });

    return Response.json({ reflection, message: "Reflection logged" }, { status: 201 });
  } catch (error) {
    console.error("Reflections POST Error:", error);
    return Response.json({ message: error.message || "Failed to log reflection" }, { status: 500 });
  }
}
