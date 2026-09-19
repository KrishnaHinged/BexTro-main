import connectDB from "@/lib/db";
import { User } from "@/models/userModel";
import { verifyAuth } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);

    const user = await User.findById(userId).select("bucketList");
    if (!user) return Response.json({ message: "User not found" }, { status: 404 });

    return Response.json({ bucketList: user.bucketList || [] }, { status: 200 });
  } catch (error) {
    console.error("Get Bucket List Error:", error);
    return Response.json({ message: error.message || "Server Error" }, { status: error.message.includes("token") ? 401 : 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);
    const body = await req.json();
    const { bucketList, action, item } = body;

    const user = await User.findById(userId);
    if (!user) return Response.json({ message: "User not found" }, { status: 404 });

    if (bucketList && Array.isArray(bucketList)) {
      user.bucketList = bucketList;
    } else if (action && item) {
      switch (action) {
        case "add":
          if (!item.text) return Response.json({ error: "Item text is required" }, { status: 400 });
          user.bucketList.push({ text: item.text, achieved: item.achieved || false });
          break;
        case "remove":
          user.bucketList = user.bucketList.filter((i) => i.text !== item.text);
          break;
        case "update":
          const index = user.bucketList.findIndex((i) => i.text === item.text);
          if (index !== -1) {
            user.bucketList[index] = { ...user.bucketList[index].toObject(), ...item };
          }
          break;
        default:
          return Response.json({ error: "Invalid action" }, { status: 400 });
      }
    } else {
      return Response.json({ error: "Invalid request format" }, { status: 400 });
    }

    await user.save();
    return Response.json({ success: true, message: "Bucket list updated", data: user.bucketList }, { status: 200 });
  } catch (error) {
    console.error("Update Bucket List Error:", error);
    return Response.json({ message: error.message || "Server Error" }, { status: error.message.includes("token") ? 401 : 500 });
  }
}
