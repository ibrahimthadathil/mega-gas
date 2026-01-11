import { getAuthUser } from "@/lib/auth/jwt";
import {
  unloadSlipRegister,
} from "@/services/serverside_api_service/user/stock/stockService";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    const { user, error: authError } = await getAuthUser();
    if (user?.id) {
      const { success } = await unloadSlipRegister(data, user?.id);
      return NextResponse.json({ success }, { status: STATUS.CREATED.code });
    } else return NextResponse.json({}, { status: STATUS.UNAUTHORIZED.code });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};

// all stock tranfered data

