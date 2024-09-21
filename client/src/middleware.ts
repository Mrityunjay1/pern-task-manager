import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token");

  // List of protected routes
  const protectedRoutes = ["/projects", "/dashboard", "/tasks"];

  // If token is not available and the route is protected, redirect to login
  if (!token && protectedRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If user is authenticated and trying to access login page, redirect to home
  if (token && req.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/projects", "/dashboard", "/tasks", "/login"],
};
