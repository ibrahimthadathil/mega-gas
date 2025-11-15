import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import supabaseAdmin from "@/lib/supabase/supabaseAdmin";
import { STATUS } from "@/types/types";

const isProd = process.env.NODE_ENV === "production";
const ACCESS_TOKEN_MAX_AGE = 60 * 60; // 1 hour
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function setAuthCookies(
  res: NextResponse,
  tokens: { access_token: string; refresh_token: string }
) {
  res.cookies.set("access_token", tokens.access_token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    maxAge: ACCESS_TOKEN_MAX_AGE,
    path: "/",
  });

  res.cookies.set("refresh_token", tokens.refresh_token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    maxAge: REFRESH_TOKEN_MAX_AGE,
    path: "/",
  });
}

function clearAuthCookies(res: NextResponse) {
  res.cookies.set("access_token", "", {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  res.cookies.set("refresh_token", "", {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { success: false, message: "Missing refresh token" },
      { status: STATUS.UNAUTHORIZED.code }
    );
  }

  try {
    const { data, error } = await supabaseAdmin.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data?.session) {
      const res = NextResponse.json(
        { success: false, message: error?.message ?? "Unable to refresh session" },
        { status: STATUS.UNAUTHORIZED.code }
      );
      clearAuthCookies(res);
      return res;
    }

    const res = NextResponse.json(
      {
        success: true,
        message: "Session refreshed",
        profile: data.user,
      },
      { status: STATUS.SUCCESS.code }
    );

    setAuthCookies(res, {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });

    return res;
  } catch (error) {
    const res = NextResponse.json(
      {
        success: false,
        message: (error as Error).message ?? "Unknown error",
      },
      { status: STATUS.SERVER_ERROR.code }
    );
    clearAuthCookies(res);
    return res;
  }
}

