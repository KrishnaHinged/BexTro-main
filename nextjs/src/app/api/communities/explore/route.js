import connectDB from "@/lib/db";
import Community from "@/models/Community";
import { verifyAuth } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);

    const communities = await Community.find({ members: { $ne: userId } })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const payload = communities.map(c => {
      const memberCount = c.members?.length || 0;
      delete c.members;
      return { ...c, memberCount };
    });

    return Response.json(payload, { status: 200 });
  } catch (error) {
    console.error("Community Explore Error:", error);
    return Response.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
