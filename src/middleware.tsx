import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import supabaseAdmin from "@/lib/supabase/supabaseAdmin";
import { getUserProfileByAuthId, normalizeRole } from "@/lib/auth/edgeAuth";
import { getAllowedRolesForRoute } from "@/lib/auth/routePermissions";

const AUTH_ROUTES = ["/user/login"];
const PROTECTED_PREFIXES = ["/admin", "/user"];
const ADMIN_DEFAULT_ROLES = ["admin", "manager", "accountant"];
const USER_DEFAULT_ROLES = [
  "admin",
  "manager",
  "accountant",
  "driver",
  "godown_keeper",
  "plant_driver",
  "staff",
];
const ROLE_DEFAULT_ROUTES: Record<string, string> = {
  admin: "/admin/dashboard",
  manager: "/admin/dashboard",
  accountant: "/admin/dashboard",
  driver: "/user/dashboard",
  godown_keeper: "/user/dashboard",
  plant_driver: "/user/dashboard",
  staff: "/user/dashboard",
};

const isProd = process.env.NODE_ENV === "production";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sanitizedPath =
    pathname === "/" ? pathname : pathname.replace(/\/+$/, "") || "/";

  const isAuthRoute = AUTH_ROUTES.includes(sanitizedPath);
  let allowedRoles = getAllowedRolesForRoute(sanitizedPath);

  if (!allowedRoles && sanitizedPath.startsWith("/admin")) {
    allowedRoles = ADMIN_DEFAULT_ROLES;
  } else if (!allowedRoles && sanitizedPath.startsWith("/user") && !isAuthRoute) {
    allowedRoles = USER_DEFAULT_ROLES;
  }

  const needsAuth =
    !isAuthRoute &&
    (allowedRoles !== null ||
      PROTECTED_PREFIXES.some((prefix) => sanitizedPath.startsWith(prefix)));

  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  const {
    user,
    tokensToSet,
    shouldClearCookies,
  } = await resolveUser(accessToken, refreshToken);

  if (isAuthRoute) {
    if (user) {
      const { profile } = await getUserProfileByAuthId(user.id);
      if (profile) {
        return attachCookieHeaders(
          NextResponse.redirect(new URL(getDefaultRouteForRole(profile.role), req.url)),
          tokensToSet,
          shouldClearCookies
        );
      }
    }
    return NextResponse.next();
  }

  if (!needsAuth) {
    return attachCookieHeaders(NextResponse.next(), tokensToSet, shouldClearCookies);
  }

  if (!user) {
    return redirectToLogin(req, tokensToSet, shouldClearCookies);
  }

  const { profile } = await getUserProfileByAuthId(user.id);
  if (!profile) {
    return redirectToLogin(req, tokensToSet, true);
  }

  const normalizedRole = normalizeRole(profile.role);

  if (allowedRoles && allowedRoles.length && !allowedRoles.includes(normalizedRole)) {
    return attachCookieHeaders(
      NextResponse.redirect(new URL(getDefaultRouteForRole(profile.role), req.url)),
      tokensToSet,
      shouldClearCookies
    );
  }

  return attachCookieHeaders(NextResponse.next(), tokensToSet, shouldClearCookies);
}

async function resolveUser(
  accessToken?: string,
  refreshToken?: string
) {
  const result = {
    user: null as { id: string; email?: string | null } | null,
    tokensToSet: null as { access_token: string; refresh_token: string } | null,
    shouldClearCookies: false,
  };

  if (accessToken) {
    const { data, error } = await supabaseAdmin.auth.getUser(accessToken);
    if (!error && data?.user) {
      result.user = { id: data.user.id, email: data.user.email };
      return result;
    }
  }

  if (refreshToken) {
    const { data, error } = await supabaseAdmin.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (!error && data?.session && data.user) {
      result.user = { id: data.user.id, email: data.user.email };
      result.tokensToSet = {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      };
      return result;
    }
  }

  result.shouldClearCookies = Boolean(accessToken || refreshToken);
  return result;
}

function getDefaultRouteForRole(role?: string | null) {
  const normalized = normalizeRole(role);
  return ROLE_DEFAULT_ROUTES[normalized] ?? "/user/dashboard";
}

function attachCookieHeaders(
  res: NextResponse,
  tokensToSet: { access_token: string; refresh_token: string } | null,
  shouldClearCookies: boolean
) {
  if (tokensToSet) {
    res.cookies.set("access_token", tokensToSet.access_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      maxAge: 60 * 60,
      path: "/",
    });
    res.cookies.set("refresh_token", tokensToSet.refresh_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
  } else if (shouldClearCookies) {
    res.cookies.set("access_token", "", {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });
    res.cookies.set("refresh_token", "", {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });
  }
  return res;
}

function redirectToLogin(
  req: NextRequest,
  tokensToSet: { access_token: string; refresh_token: string } | null,
  shouldClearCookies: boolean
) {
  const loginUrl = new URL("/user/login", req.url);
  loginUrl.searchParams.set("from", req.nextUrl.pathname);
  return attachCookieHeaders(NextResponse.redirect(loginUrl), tokensToSet, shouldClearCookies);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
