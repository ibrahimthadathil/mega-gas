import { getAuthUser } from "@/lib/auth/jwt";
import { getAllChestSummary, registerCashAdjust } from "@/services/serverside_api_service/admin/chest-summery/ches-summary-service";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const searchParms = req.nextUrl.searchParams;

    const filter = {
      chest: (searchParms.get("chest") as "godown" | "office") ?? undefined,
      status:
        (searchParms.get("status") as "settled" | "submitted") ?? undefined,
    };

    const { success, data, message } = await getAllChestSummary(filter);

    if (success)
      return NextResponse.json(
        { success, data },
        { status: STATUS.SUCCESS.code },
      );
    else
      return NextResponse.json(
        { success, message },
        { status: STATUS.NO_CONTENT.code },
      );
  } catch (error) {
    return NextResponse.json(
      { messsage: STATUS.SERVER_ERROR.message },
      { status: STATUS.SERVER_ERROR.code },
    );
  }
};


export const POST = async (req: NextRequest) => {
  try {
    const { user } = await getAuthUser();
    const data = await req.json();
    if (user) {
      const { success, message } = await registerCashAdjust(user.id, data);
      if (success)
        return NextResponse.json(
          { success, message: STATUS.SUCCESS.message },
          { status: STATUS.SUCCESS.code },
        );
      else
        return NextResponse.json(
          { success, message },
          { status: STATUS.SERVER_ERROR.code },
        );
    } else
      return NextResponse.json(
        { message: STATUS.UNAUTHORIZED.message },
        { status: STATUS.UNAUTHORIZED.code },
      );
  } catch (error) {
    return NextResponse.json(
      { message: STATUS.SERVER_ERROR.message },
      { status: STATUS.SERVER_ERROR.code },
    );
  }
};