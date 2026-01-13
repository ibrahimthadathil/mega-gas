// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getAuthUser, getUserProfile } from "@/lib/auth/jwt";

// export interface AuthRequest extends NextRequest {
//   user?: string;
// }

// // Routes that require authentication
// const protectedRoutes = ["/user/dashboard", "/admin"];
// // Routes that should redirect to dashboard if already authenticated
// const authRoutes = ["/user/login"];

// export async function middleware(req: AuthRequest) {
//   const { pathname } = req.nextUrl;
//   const token = req.cookies.get("access_token")?.value;

//   // Check if route is protected
//   const isProtectedRoute = protectedRoutes.some((route) =>
//     pathname.startsWith(route)
//   );

//   const isAuthRoute = authRoutes.includes(pathname);

//   // If accessing protected route, verify authentication
//   if (isProtectedRoute) {
//     if (!token) {
//       const loginUrl = new URL("/user/login", req.url);
//       // loginUrl.searchParams.set("from", pathname);
//       return NextResponse.redirect(loginUrl);
//     }
//     // Verify token and get user
//     const { user, error } = await getAuthUser();

//     if (error || !user) {
//       const loginUrl = new URL("/user/login", req.url);
//       loginUrl.searchParams.set("from", pathname);
//       // Clear invalid token
//       const response = NextResponse.redirect(loginUrl);
//       response.cookies.delete("access_token");
//       response.cookies.delete("refresh_token");
//       return response;
//     }

//     // Check admin routes
//     if (pathname.startsWith("/admin")) {
//       const { profile, error: profileError } = await getUserProfile(
//         req,
//         user.id
//       );

//       if (profileError || !profile) {
//         const loginUrl = new URL("/user/login", req.url);
//         loginUrl.searchParams.set("from", pathname);
//         return NextResponse.redirect(loginUrl);
//       }

//       if (String(profile.role).toLowerCase() !== "admin") {
//         // Redirect non-admin users to user dashboard
//         return NextResponse.redirect(new URL("/user/dashboard", req.url));
//       }
//     }
//   }

//   // If already authenticated and trying to access auth routes, redirect to dashboard
//   const { user } = await getAuthUser();
//   if (isAuthRoute && token) {
//     if (user) {
//       const { profile } = await getUserProfile(req, user.id);
//       if (profile) {
//         const redirectPath =
//           String(profile.role).toLowerCase() === "admin"
//             ? "/admin/dashboard"
//             : "/user/dashboard";
//         return NextResponse.redirect(new URL(redirectPath, req.url));
//       }
//     }
//   }
//   if (user?.id) {
//     const response = NextResponse.next();
//     response.headers.set("x-user-id", user.id);
//     return response;
//   }

//   return NextResponse.next();
// }

// // Configure which routes should trigger middleware
// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     "/((?!api/user/auth/login|_next/static|_next/image|favicon.ico).*)",
//   ],
// };

// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthUser, getUserProfile } from "@/lib/auth/jwt";
import { roleRouteConfig } from "./configuration/navConfig";

export interface AuthRequest extends NextRequest {
  user?: string;
}

// Routes that don't require authentication
const publicRoutes = ["/", "/about", "/contact"];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/user/login", "/user/register"];

// Get default dashboard based on role
function getDefaultDashboard(role: string): string {
  const roleLower = role.toLowerCase();

  // Admin and Manager go to admin dashboard
  if (roleLower === "admin" || roleLower === "manager") {
    return "/admin/dashboard";
  }

  // Everyone else goes to user dashboard
  return "/user/dashboard";
}

// Check if user has access to the route based on their role
function hasRouteAccess(pathname: string, role: string): boolean {
  const roleLower = role.toLowerCase();
  const allowedRoutes =
    roleRouteConfig[roleLower as keyof typeof roleRouteConfig];

  if (!allowedRoutes) {
    return false;
  }

  // Check if the pathname starts with any of the allowed routes
  return allowedRoutes.some((route) => pathname.startsWith(route));
}

export async function middleware(req: AuthRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("access_token")?.value;

  // Allow public routes
  const isPublicRoute = publicRoutes.some((route) => pathname === route);
  if (isPublicRoute) {
    return NextResponse.next();
  }

  const isAuthRoute = authRoutes.includes(pathname);

  // Block access to auth routes (login/register) if user is already authenticated
  if (isAuthRoute) {
    if (token) {
      const { user, error } = await getAuthUser();

      // If token is valid and user exists, redirect to dashboard
      if (!error && user) {
        const { profile, error: profileError } = await getUserProfile(
          req,
          user.id
        );

        if (!profileError && profile) {
          const redirectPath = getDefaultDashboard(profile.role);
          return NextResponse.redirect(new URL(redirectPath, req.url));
        }
      } else {
        // Token exists but is invalid - clear it and allow access to login
        const response = NextResponse.next();
        response.cookies.delete("access_token");
        response.cookies.delete("refresh_token");
        return response;
      }
    }
    // No token - allow access to auth routes
    return NextResponse.next();
  }

  // For protected routes, check authentication
  const isProtectedRoute =
    pathname.startsWith("/user") || pathname.startsWith("/admin");

  if (isProtectedRoute) {
    // Check if user is authenticated
    if (!token) {
      const loginUrl = new URL("/user/login", req.url);
      loginUrl.searchParams.set("from", pathname);
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

    // Get user profile to check role
    const { profile, error: profileError } = await getUserProfile(req, user.id);

    if (profileError || !profile) {
      const loginUrl = new URL("/user/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }

    // Check if user has access to this route based on their role
    if (!hasRouteAccess(pathname, profile.role)) {
      // Redirect to their default dashboard
      const redirectPath = getDefaultDashboard(profile.role);
      return NextResponse.redirect(new URL(redirectPath, req.url));
    }

    // Add user info to headers for use in the application
    const response = NextResponse.next();
    response.headers.set("x-user-id", user.id);
    response.headers.set("x-user-role", profile.role.toLowerCase());
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
     * - public files
     */
    "/((?!api/user/auth/login|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
