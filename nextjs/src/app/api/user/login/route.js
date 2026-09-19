import connectDB from "@/lib/db";
import { User } from "@/models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    await connectDB();
    const { username, password } = await req.json();

    if (!username || !password) {
      return Response.json({ message: "All fields are required" }, { status: 400 });
    }

    const user = await User.findOne({ username: username.trim() });
    if (!user) {
      return Response.json({ message: "Invalid credentials" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password.trim(), user.password);
    if (!isMatch) {
      return Response.json({ message: "Invalid credentials" }, { status: 400 });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET_KEY || process.env.JWT_SECRET || "hello_secret",
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
