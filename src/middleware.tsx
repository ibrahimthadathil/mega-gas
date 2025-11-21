import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthUser, getUserProfile } from "@/lib/auth/jwt";

export interface AuthRequest extends NextRequest {
  user?: string;
}

// Routes that require authentication
const protectedRoutes = ["/user/dashboard", "/admin"];
// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/user/login"];

export async function middleware(req: AuthRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("access_token")?.value;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.includes(pathname);

  // If accessing protected route, verify authentication
  if (isProtectedRoute) {
    if (!token) {
      const loginUrl = new URL("/user/login", req.url);
      // loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Verify token and get user
    const { user, error } = await getAuthUser();

    if (error || !user) {
      const loginUrl = new URL("/user/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      // Clear invalid token
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }

    // Check admin routes
    if (pathname.startsWith("/admin")) {
      const { profile, error: profileError } = await getUserProfile(
        req,
        user.id
      );

      if (profileError || !profile) {
        const loginUrl = new URL("/user/login", req.url);
        loginUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(loginUrl);
      }

      if (String(profile.role).toLowerCase() !== "admin") {
        // Redirect non-admin users to user dashboard
        return NextResponse.redirect(new URL("/user/dashboard", req.url));
      }
    }
  }

  // If already authenticated and trying to access auth routes, redirect to dashboard
  const { user } = await getAuthUser();
  if (isAuthRoute && token) {
    if (user) {
      const { profile } = await getUserProfile(req, user.id);
      if (profile) {
        const redirectPath =
          String(profile.role).toLowerCase() === "admin"
            ? "/admin/dashboard"
            : "/user/dashboard";
        return NextResponse.redirect(new URL(redirectPath, req.url));
      }
    }
  }
  if (user?.id) {
    const response = NextResponse.next();
    response.headers.set("x-user-id", user.id);
    return response;
  }

  return NextResponse.next();
}

// Configure which routes should trigger middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/user/auth/login|_next/static|_next/image|favicon.ico).*)",
  ],
};
