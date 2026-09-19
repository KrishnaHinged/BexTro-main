import connectDB from "@/lib/db";
import { User } from "@/models/userModel";
import bcrypt from "bcryptjs";
import { rateLimit } from "@/lib/rateLimiter";

export async function POST(req) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    const limitCheck = rateLimit(`register:${ip}`, 4, 60000);
    if (!limitCheck.success) {
      return Response.json(
        { message: `Too many registration attempts. Please wait ${limitCheck.retryAfter} seconds.` },
        { status: 429 }
      );
    }

    await connectDB();
    const body = await req.json();

    const fullName = typeof body?.fullName === "string" ? body.fullName.trim() : "";
    const username = typeof body?.username === "string" ? body.username.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";
    const confirmpassword = typeof body?.confirmpassword === "string" ? body.confirmpassword : "";
    const gender = typeof body?.gender === "string" ? body.gender : "";

    if (!fullName || !username || !password || !confirmpassword || !gender) {
      return Response.json({ message: "All fields are required" }, { status: 400 });
    }

    if (username.length < 3 || username.length > 30 || !/^[a-zA-Z0-9_]+$/.test(username)) {
      return Response.json({ message: "Username must be 3-30 alphanumeric characters or underscores" }, { status: 400 });
    }

    if (password.length < 6) {
      return Response.json({ message: "Password must be at least 6 characters long" }, { status: 400 });
    }

    if (password !== confirmpassword) {
      return Response.json({ message: "Passwords do not match" }, { status: 400 });
    }

    const userExists = await User.findOne({ username });
    if (userExists) {
      return Response.json({ message: "Username already exists" }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const profilePhoto = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=256`;

    await User.create({
      fullName,
      username,
      password: hashedPassword,
      profilePhoto,
      gender,
      score: 0,
      role: "user",
    });

    return Response.json({ message: "User registered successfully", success: true }, { status: 201 });
  } catch (error) {
    console.error("Register Error:", error);
    return Response.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
