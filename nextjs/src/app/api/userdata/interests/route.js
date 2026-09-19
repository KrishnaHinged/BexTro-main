import connectDB from "@/lib/db";
import { User } from "@/models/userModel";
import { verifyAuth } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);

    const user = await User.findById(userId).select("interests");
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }
    return Response.json({ interests: user.interests || [] }, { status: 200 });
  } catch (error) {
    console.error("Get Interests Error:", error);
    return Response.json({ message: error.message || "Server Error" }, { status: error.message.includes("token") ? 401 : 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);
    const { interest, action } = await req.json();

    if (!interest || !action) {
      return Response.json({ error: "Interest and action are required" }, { status: 400 });
    }
    if (!["add", "remove"].includes(action)) {
      return Response.json({ error: "Invalid action" }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    if (action === "add" && !user.interests.includes(interest)) {
      user.interests.push(interest);
    } else if (action === "remove") {
      user.interests = user.interests.filter((i) => i !== interest);
    }

    await user.save();
    return Response.json({ success: true, message: "Interests updated", data: user.interests }, { status: 200 });
  } catch (error) {
    console.error("Update Interests Error:", error);
    return Response.json({ message: error.message || "Server Error" }, { status: error.message.includes("token") ? 401 : 500 });
  }
}
