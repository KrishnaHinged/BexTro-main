import connectDB from "@/lib/db";
import Community from "@/models/Community";
import { verifyAuth } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);
    const { communityId } = await params;

    const community = await Community.findById(communityId);
    if (!community) return Response.json({ message: "Community not found" }, { status: 404 });

    const isMember = (community.members || []).some(id => id.toString() === userId.toString());
    if (!isMember) {
      return Response.json({ message: "Not a member" }, { status: 400 });
    }

    community.members = (community.members || []).filter(id => id.toString() !== userId.toString());
    await community.save();

    return Response.json({ message: "You left the community", communityId, success: true }, { status: 200 });
  } catch (error) {
    console.error("Leave Community Error:", error);
    return Response.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
