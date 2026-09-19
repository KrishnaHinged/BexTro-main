import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function verifyAuth(request) {
  let token = null;

  // 1. Try to extract from cookie store
  try {
    const cookieStore = await cookies();
    token = cookieStore.get("token")?.value;
  } catch (e) {
    // cookies() might throw if not called inside a request environment
  }

  // 2. Try to extract from Authorization header if request is provided
  if (!token && request) {
    try {
      const authHeader = request.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    } catch (e) {
      // request.headers might not be accessible
    }
  }

  if (!token) {
    throw new Error("No token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || process.env.JWT_SECRET);
    return {
      userId: decoded.userId || decoded.id,
      role: decoded.role || "user",
      username: decoded.username,
    };
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

export async function isAdminAuth(request) {
  const payload = await verifyAuth(request);
  if (payload.role !== "admin") {
    throw new Error("Access denied: Admins only");
  }
  return payload;
}
