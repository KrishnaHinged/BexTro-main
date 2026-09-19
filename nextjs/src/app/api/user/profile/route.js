import connectDB from "@/lib/db";
import { User } from "@/models/userModel";
import { verifyAuth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET(req) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }
    return Response.json(user, { status: 200 });
  } catch (error) {
    console.error("Get Profile Route Error:", error);
    return Response.json({ message: error.message || "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);

    const contentType = req.headers.get("content-type") || "";
    let fullName, username, isPrivate, profilePhotoPath;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      fullName = formData.get("fullName");
      username = formData.get("username");
      const isPrivateStr = formData.get("isPrivate");
      isPrivate = isPrivateStr === "true" || isPrivateStr === true;

      const file = formData.get("profilePhoto");
      if (file && typeof file === "object" && file.name) {
        const { validateAndExtractUpload } = await import("@/lib/uploadSecurity");
        const { safeFilename, buffer } = await validateAndExtractUpload(file, "profilePhoto");
        
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadsDir, { recursive: true });

        const filePath = path.join(uploadsDir, safeFilename);
        await writeFile(filePath, buffer);
        profilePhotoPath = `/uploads/${safeFilename}`;
      }
    } else {
      const body = await req.json();
      fullName = body.fullName;
      username = body.username;
      isPrivate = body.isPrivate;
    }

    if (!fullName || !username) {
      return Response.json({ message: "Full name and username are required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ username: username.trim(), _id: { $ne: userId } });
    if (existingUser) {
      return Response.json({ message: "Username already exists" }, { status: 400 });
    }

    const updateData = {
      fullName,
      username: username.trim(),
      isPrivate,
    };

    if (profilePhotoPath) {
      updateData.profilePhoto = profilePhotoPath;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { returnDocument: 'after' }).select("-password");

    return Response.json({
      message: "Profile updated successfully!",
      user: updatedUser,
    }, { status: 200 });

  } catch (error) {
    const isAuth = error.message?.includes("token");
    if (!isAuth) console.error("Update Profile Route Error:", error);
    return Response.json({ message: error.message || "Server Error" }, { status: isAuth ? 401 : 500 });
  }
}
