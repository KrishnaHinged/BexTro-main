import connectDB from "@/lib/db";
import Community from "@/models/Community";
import { verifyAuth } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);

    const communities = await Community.find({ members: userId })
      .sort({ createdAt: -1 })
      .lean();

    const payload = communities.map(c => {
      const memberCount = c.members?.length || 0;
      delete c.members;
      return { ...c, memberCount };
    });

    return Response.json(payload, { status: 200 });
  } catch (error) {
    console.error("My Communities Error:", error);
    return Response.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
