import { userLoginService } from "@/services/serverside_api_service/user/authService/authService";
import { STATUS } from "@/types/types";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const data = await req.json();
    const { message, profile, session, success } = await userLoginService(data);
    if (success) {
      const res = NextResponse.json(
        { message, profile, success },
        { status: STATUS.SUCCESS.code }
      );

      if (session?.access_token) {
        res.cookies.set("access_token", session.access_token, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 60 * 60, // 1 hour
          path: "/",
        });
      }
      if (session?.refresh_token) {
        res.cookies.set("refresh_token", session.refresh_token, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: "/",
        });
      }

      return res;
    }

    return NextResponse.json({ message }, { status: STATUS.NOT_FOUND.code });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.UNAUTHORIZED.code }
    );
  }
};
