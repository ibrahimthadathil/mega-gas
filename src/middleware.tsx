
// // middleware.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getAuthUser, getUserProfile } from "@/lib/auth/jwt";
// import { roleRouteConfig } from "./configuration/navConfig";

// export interface AuthRequest extends NextRequest {
//   user?: string;
// }

// // Routes that don't require authentication
// const publicRoutes = ["/", "/about", "/contact"];

// // Routes that should redirect to dashboard if already authenticated
// const authRoutes = ["/user/login", "/user/register"];

// // Get default dashboard based on role
// function getDefaultDashboard(role: string): string {
//   const roleLower = role.toLowerCase();

//   // Admin and Manager go to admin dashboard
//   if (roleLower === "admin" || roleLower === "manager"||roleLower==="accountant") {
//     return "/admin/dashboard";
//   }

//   // Everyone else goes to user dashboard
//   return "/user/dashboard";
// }

// // Check if user has access to the route based on their role
// function hasRouteAccess(pathname: string, role: string): boolean {
//   const roleLower = role.toLowerCase();
//   const allowedRoutes =
//     roleRouteConfig[roleLower as keyof typeof roleRouteConfig];

//   if (!allowedRoutes) {
//     return false;
//   }

//   // Check if the pathname starts with any of the allowed routes
//   return allowedRoutes.some((route) => pathname.startsWith(route));
// }

// export async function middleware(req: AuthRequest) {
//   const { pathname } = req.nextUrl;
//   const token = req.cookies.get("access_token")?.value;

//   // Allow public routes
//   const isPublicRoute = publicRoutes.some((route) => pathname === route);
//   if (isPublicRoute) {
//     return NextResponse.next();
//   }

//   const isAuthRoute = authRoutes.includes(pathname);

//   // Block access to auth routes (login/register) if user is already authenticated
//   if (isAuthRoute) {
//     if (token) {
//       const { user, error } = await getAuthUser();

//       // If token is valid and user exists, redirect to dashboard
//       if (!error && user) {
//         const { profile, error: profileError } = await getUserProfile(
//           req,
//           user.id
//         );

//         if (!profileError && profile) {
//           const redirectPath = getDefaultDashboard(profile.role);
//           return NextResponse.redirect(new URL(redirectPath, req.url));
//         }
//       } else {
//         // Token exists but is invalid - clear it and allow access to login
//         const response = NextResponse.next();
//         response.cookies.delete("access_token");
//         response.cookies.delete("refresh_token");
//         return response;
//       }
//     }
//     // No token - allow access to auth routes
//     return NextResponse.next();
//   }

//   // For protected routes, check authentication
//   const isProtectedRoute =
//     pathname.startsWith("/user") || pathname.startsWith("/admin");

//   if (isProtectedRoute) {
//     // Check if user is authenticated
//     if (!token) {
//       const loginUrl = new URL("/user/login", req.url);
//       loginUrl.searchParams.set("from", pathname);
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

//     // Get user profile to check role
//     const { profile, error: profileError } = await getUserProfile(req, user.id);

//     if (profileError || !profile) {
//       const loginUrl = new URL("/user/login", req.url);
//       loginUrl.searchParams.set("from", pathname);
//       const response = NextResponse.redirect(loginUrl);
//       response.cookies.delete("access_token");
//       response.cookies.delete("refresh_token");
//       return response;
//     }

//     // Check if user has access to this route based on their role
//     if (!hasRouteAccess(pathname, profile.role)) {
//       // Redirect to their default dashboard
//       const redirectPath = getDefaultDashboard(profile.role);
//       return NextResponse.redirect(new URL(redirectPath, req.url));
//     }

//     // Add user info to headers for use in the application
//     const response = NextResponse.next();
//     response.headers.set("x-user-id", user.id);
//     response.headers.set("x-user-role", profile.role.toLowerCase());
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
//      * - public files
//      */
//     "/((?!api/user/auth/login|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
//   ],
// };

// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import supabaseAdmin from "@/lib/supabase/supabaseAdmin";
import { roleRouteConfig } from "./configuration/navConfig";

const publicRoutes = ["/", "/about", "/contact"];
const authRoutes = ["/user/login", "/user/register"];

function getDefaultDashboard(role: string): string {
  const r = role.toLowerCase();
  return r === "admin" || r === "manager" || r === "accountant"
    ? "/admin/dashboard"
    : "/user/dashboard";
}

function hasRouteAccess(pathname: string, role: string): boolean {
  const allowed =
    roleRouteConfig[role.toLowerCase() as keyof typeof roleRouteConfig];
  if (!allowed) return false;
  return allowed.some((route) => pathname.startsWith(route));
}

function addSecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return res;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Public routes
  if (publicRoutes.some((r) => pathname === r)) {
    return addSecurityHeaders(NextResponse.next());
  }

  // 2. Read your custom access_token cookie
  const accessToken = req.cookies.get("access_token")?.value;
  const isAuthRoute = authRoutes.includes(pathname);

  // 3. Auth routes (login/register)
  if (isAuthRoute) {
    if (!accessToken) {
      // No token → allow login page
      return addSecurityHeaders(NextResponse.next());
    }

    // Has token → verify it
    const { data, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !data?.user) {
      // Invalid token → clear and show login
      const res = NextResponse.next();
      res.cookies.delete("access_token");
      res.cookies.delete("refresh_token");
      return addSecurityHeaders(res);
    }

    // Valid token → fetch profile and redirect to dashboard
    const { data: profile } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("auth_id", data.user.id)
      .single();

    if (profile?.role) {
      return NextResponse.redirect(
        new URL(getDefaultDashboard(profile.role), req.url)
      );
    }

    return addSecurityHeaders(NextResponse.next());
  }

  // 4. Protected routes
  const isProtectedRoute =
    pathname.startsWith("/user") || pathname.startsWith("/admin");

  if (isProtectedRoute) {
    // 4a. No token → login
    if (!accessToken) {
      const loginUrl = new URL("/user/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 4b. Verify token directly with admin client
    const { data, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !data?.user) {
      const loginUrl = new URL("/user/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete("access_token");
      res.cookies.delete("refresh_token");
      return res;
    }

    // 4c. Get profile for role check
    const { data: profile } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("auth_id", data.user.id)
      .single();

    if (!profile?.role) {
      const loginUrl = new URL("/user/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = profile.role.toLowerCase();

    // 4d. Unknown role
    if (!roleRouteConfig[role as keyof typeof roleRouteConfig]) {
      console.warn(`[Middleware] Unknown role: ${role}`);
      return NextResponse.redirect(new URL("/user/login", req.url));
    }

    // 4e. Wrong route for this role
    if (!hasRouteAccess(pathname, role)) {
      return NextResponse.redirect(
        new URL(getDefaultDashboard(role), req.url)
      );
    }

    // 4f. ✅ All passed
    const res = NextResponse.next();
    res.headers.set("x-user-id", data.user.id);
    res.headers.set("x-user-role", role);
    return addSecurityHeaders(res);
  }

  return addSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    "/((?!api/user/auth/login|api/user/auth/register|api/user/auth/refresh|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};