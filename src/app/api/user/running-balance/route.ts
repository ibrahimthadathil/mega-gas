import { runningBalancebyWarehouse } from "@/services/serverside_api_service/user/current-stock/current-stock-service";
import { RunningBalanceFilters } from "@/types/stock";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams
    const filter:RunningBalanceFilters = {
        endDate: searchParams.get('endDate')||undefined,
        productId:searchParams.get('productId')||undefined,
        startDate:searchParams.get('startDate')||undefined,
        warehouseId:searchParams.get('warehouseId')||undefined,
    }

    const { success, data, message } = await runningBalancebyWarehouse(filter);
    if(success) return NextResponse.json({success,data},{status:STATUS.SUCCESS.code})
    else return NextResponse.json({message,success},{status:STATUS.NOT_FOUND.code})
  } catch (error) {
    return NextResponse.json({message:(error as Error).message},{status:STATUS.SERVER_ERROR.code})
  }
};
