import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("token");

    return Response.json({
      message: "Logged out successfully",
      success: true,
    }, { status: 200 });
  } catch (error) {
    console.error("Logout Error:", error);
    return Response.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
