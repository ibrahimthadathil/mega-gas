import { runningBalancebyWarehouse } from "@/services/serverside_api_service/user/current-stock/current-stock-service";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const { success, data, message } = await runningBalancebyWarehouse();
    if(success) return NextResponse.json({success,data},{status:STATUS.SUCCESS.code})
    else return NextResponse.json({message,success},{status:STATUS.NOT_FOUND.code})
  } catch (error) {
    return NextResponse.json({message:(error as Error).message},{status:STATUS.SERVER_ERROR.code})
  }
};
