import connectDB from "@/lib/db";
import { User } from "@/models/userModel";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();
    const { fullName, username, password, confirmpassword, gender } = await req.json();

    if (!fullName || !username || !password || !confirmpassword || !gender) {
      return Response.json({ message: "All fields are required" }, { status: 400 });
    }

    if (password !== confirmpassword) {
      return Response.json({ message: "Passwords do not match" }, { status: 400 });
    }

    const userExists = await User.findOne({ username: username.trim() });
    if (userExists) {
      return Response.json({ message: "Username already exists" }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password.trim(), salt);

    const profilePhoto = `https://ui-avatars.com/api/?name=${encodeURIComponent(username.trim())}&background=random&color=fff&size=256`;

    const newUser = await User.create({
      fullName,
      username: username.trim(),
      password: hashedPassword,
      profilePhoto,
      gender,
      score: 0,
    });

    console.log("User Created Successfully:", newUser);

    return Response.json({ message: "User registered successfully", success: true }, { status: 201 });
  } catch (error) {
    console.error("Register Error:", error);
    return Response.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
