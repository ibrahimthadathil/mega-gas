import { getAuthUser } from "@/lib/auth/jwt";
import {
  displayStockTransfer,
  transferStock,
} from "@/services/serverside_api_service/user/stock/stockService";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

// tranfer stock from warehouse to warehouse / office
export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    const { user, error: authError } = await getAuthUser();
    if (user?.id) {
      const { success } = await transferStock(data, user?.id);
      return NextResponse.json({ success }, { status: STATUS.SUCCESS.code });
    } else
      return NextResponse.json(
        { message: STATUS.FORBIDDEN.message },
        { status: STATUS.FORBIDDEN.code },
      );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.UNAUTHORIZED.code },
    );
  }
};
// showing all transfered stock from vehicle to vehicle/godown/office
export const GET = async (req: NextRequest) => {
  try {
    const { user, error: authError } = await getAuthUser();
    const searchParams = req.nextUrl.searchParams;
    const filter = {
      startDate: searchParams.get("startDate") ?? undefined,
      endDate: searchParams.get("endDate") ?? undefined,
       warehouseId: searchParams.get("warehouseId") ?? undefined,
      page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 16,
    };
    if (user?.id) {
      // const { success, result } = await getTransferedView(user?.id);
      const { success, data, count } = await displayStockTransfer(filter);
      return NextResponse.json(
        { success, data: { data, count } },
        { status: STATUS.SUCCESS.code },
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
