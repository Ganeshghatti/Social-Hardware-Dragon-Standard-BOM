import { NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Get token directly from cookies in middleware
  const token = request.cookies.get("auth-token")?.value;

  // Skip auth check for public routes
  if (
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/admin/ensure") ||
    pathname.startsWith("/api/init") ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // Check auth for all /admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      console.log("Middleware - No token found for:", pathname);
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      console.log("Middleware - Invalid token for:", pathname);
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    console.log("Middleware - Auth successful for:", pathname);

    // Attach userId to request headers for API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", decoded.userId);
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Check auth for API routes (except login and init)
  if (
    pathname.startsWith("/api") &&
    !pathname.startsWith("/api/auth/login") &&
    !pathname.startsWith("/api/admin/ensure") &&
    !pathname.startsWith("/api/init")
  ) {
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", decoded.userId);
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
