import { NextResponse } from "next/server";

function clearAuthCookies(res: NextResponse) {
  const isProd = process.env.NODE_ENV === "production";
  // Explicitly overwrite with expired, matching attributes for reliable deletion
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
  const res = NextResponse.json({ success: true, message: "Logged out" });
  clearAuthCookies(res);
  return res;
}

export async function GET(request: Request) {
  const url = new URL("/user/login", request.url);
  const res = NextResponse.redirect(url);
  clearAuthCookies(res);
  return res;
}


