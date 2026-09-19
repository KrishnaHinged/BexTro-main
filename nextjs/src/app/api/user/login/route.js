import connectDB from "@/lib/db";
import { User } from "@/models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { rateLimit } from "@/lib/rateLimiter";

export async function POST(req) {
  try {
    // Rate limit login attempts: 5 per minute per IP
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    const limitCheck = rateLimit(`login:${ip}`, 5, 60000);
    if (!limitCheck.success) {
      return Response.json(
        { message: `Too many login attempts. Please wait ${limitCheck.retryAfter} seconds.` },
        { status: 429 }
      );
    }

    await connectDB();
    const body = await req.json();
    const username = typeof body?.username === "string" ? body.username.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!username || !password) {
      return Response.json({ message: "Username and password are required" }, { status: 400 });
    }

    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return Response.json({ message: "Invalid credentials" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return Response.json({ message: "Invalid credentials" }, { status: 400 });
    }

    const secret = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("Server security error: JWT_SECRET is not configured");
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      secret,
      { expiresIn: "1d" }
    );

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 1 day in seconds
      path: "/",
    });

    return Response.json({
      message: "Login successful",
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        profilePhoto: user.profilePhoto,
        score: user.score,
        role: user.role,
      },
    }, { status: 200 });
  } catch (error) {
    console.error("Login Error:", error);
    return Response.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
