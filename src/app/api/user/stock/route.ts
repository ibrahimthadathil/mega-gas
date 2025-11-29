import { unloadSlipRegister } from "@/services/serverside_api_service/user/stock/stockService";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await unloadSlipRegister()
    return NextResponse.json({}, { status: STATUS.CREATED.code });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};
