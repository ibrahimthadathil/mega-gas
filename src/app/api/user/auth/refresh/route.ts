// app/api/user/auth/refresh/route.ts
import { NextResponse } from "next/server";
import { STATUS } from "@/types/types";
import { createClient } from "@/lib/supabase/supabaseServer";

export const POST = async (req: Request) => {
  try {
    const refreshToken = req.headers
      .get("cookie")
      ?.split(";")
      .find((c) => c.trim().startsWith("refresh_token="))
      ?.split("=")[1]
      ?.trim();

    if (!refreshToken) {
      return NextResponse.json(
        { error: "No refresh token" },
        { status: STATUS.UNAUTHORIZED.code }
      );
    }

    const supabase = await createClient();

    // Exchange refresh token for new session
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
      return NextResponse.json(
        { error: "Session expired. Please login again." },
        { status: STATUS.UNAUTHORIZED.code }
      );
    }

    const res = NextResponse.json(
      { success: true },
      { status: STATUS.SUCCESS.code }
    );

    // Set new access token
    res.cookies.set("access_token", data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60,
      path: "/",
    });

    // Set new refresh token (Supabase rotates it)
    res.cookies.set("refresh_token", data.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/api/user/auth/refresh", // scoped to refresh route only
    });

    return res;
  } catch (error) {
    console.error("[REFRESH ERROR]", error);
    return NextResponse.json(
      { error: STATUS.SERVER_ERROR.message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};