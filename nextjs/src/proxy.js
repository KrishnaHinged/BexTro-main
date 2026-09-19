import { NextResponse } from "next/server";

// Routes that require user authentication
const PROTECTED_ROUTES = [
  "/dashboard",
  "/feed",
  "/goals",
  "/profile",
  "/settings",
  "/chats",
  "/notifications",
  "/growth-twin",
  "/communities",
  "/welcome",
  "/set_challenges",
];

// Routes reserved for admins only
const ADMIN_ROUTES = [
  "/admindashboard",
  "/adminchats",
];

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));

  // 1. Unauthenticated access to protected or admin pages
  if ((isProtected || isAdminRoute) && !token) {
    const signinUrl = new URL("/signin", request.url);
    signinUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signinUrl);
  }

  // 2. Authenticated users trying to access login/signup pages
  if (token && (pathname === "/signin" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/feed/:path*",
    "/goals/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/chats/:path*",
    "/notifications/:path*",
    "/growth-twin/:path*",
    "/communities/:path*",
    "/welcome/:path*",
    "/set_challenges/:path*",
    "/admindashboard/:path*",
    "/adminchats/:path*",
    "/signin",
    "/signup",
  ],
};
