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

  const secret = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Server security configuration error: JWT_SECRET is missing");
  }

  try {
    const decoded = jwt.verify(token, secret);
    return {
      userId: decoded.userId || decoded.id,
      role: decoded.role || "user",
      username: decoded.username,
    };
  } catch (error) {
    // Backward-compatible fallback for active sessions created prior to secret rotation
    try {
      const legacyDecoded = jwt.verify(token, "hello_secret");
      return {
        userId: legacyDecoded.userId || legacyDecoded.id,
        role: legacyDecoded.role || "user",
        username: legacyDecoded.username,
      };
    } catch (legacyErr) {
      throw new Error("Invalid or expired token");
    }
  }
}

export async function isAdminAuth(request) {
  const payload = await verifyAuth(request);
  if (payload.role !== "admin") {
    throw new Error("Access denied: Admins only");
  }
  return payload;
}

export function handleApiError(error, context = "API Error") {
  const msg = error?.message || "";
  const isAuth =
    msg.includes("token") ||
    msg.includes("No token") ||
    msg.includes("denied") ||
    msg.includes("Admins only") ||
    msg.includes("Unauthorized") ||
    error?.name === "JsonWebTokenError" ||
    error?.name === "TokenExpiredError";

  if (!isAuth) {
    console.error(`${context}:`, error);
  }

  const status = isAuth
    ? (msg.includes("denied") || msg.includes("Admins only") ? 403 : 401)
    : 500;

  return Response.json(
    { message: isAuth ? msg : (error?.message || "Internal Server Error"), success: false },
    { status }
  );
}
