import connectDB from "@/lib/db";
import Community from "@/models/Community";
import { verifyAuth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);

    const formData = await req.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const coverColor = formData.get("coverColor") || "from-indigo-500 to-purple-600";
    
    // Parse tags JSON string if exists
    let tags = [];
    const tagsRaw = formData.get("tags");
    if (tagsRaw) {
      try {
        tags = JSON.parse(tagsRaw);
      } catch (e) {
        tags = tagsRaw.split(",").map(t => t.trim()).filter(Boolean);
      }
    }

    if (!name || !description) {
      return Response.json({ message: "Name and Description are required" }, { status: 400 });
    }

    const existing = await Community.findOne({ name });
    if (existing) {
      return Response.json({ message: "A community with this name already exists" }, { status: 400 });
    }

    let profilePhotoPath = "";
    const file = formData.get("profilePhoto");
    if (file && typeof file === "object" && file.name) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });

      const filename = `community-${Date.now()}${path.extname(file.name)}`;
      const filePath = path.join(uploadsDir, filename);
      await writeFile(filePath, buffer);
      profilePhotoPath = `/uploads/${filename}`;
    }

    const newCommunity = await Community.create({
      name,
      description,
      creator: userId,
      admins: [userId],
      members: [userId],
      tags,
      coverColor,
      profilePhoto: profilePhotoPath,
    });

    return Response.json({ message: "Community created!", community: newCommunity, success: true }, { status: 201 });
  } catch (error) {
    console.error("Community Create Error:", error);
    return Response.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
