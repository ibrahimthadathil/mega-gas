import { userLoginService } from "@/services/user/authService/authService";
import { STATUS } from "@/types/types";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const data = await req.json();
    const { message, access_token, refresh_token, profile, success } =
      await userLoginService(data);
    if (success && refresh_token) {
      const res = NextResponse.json(
        { message, profile, success ,access_token},
        { status: STATUS.SUCCESS.code }
      );

      res.cookies.set("rfr_token", refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24,
      });

      return res;
    }

    return NextResponse.json({ message }, { status: STATUS.NOT_FOUND.code });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.UNAUTHORIZED.code }
    );
  }
};
