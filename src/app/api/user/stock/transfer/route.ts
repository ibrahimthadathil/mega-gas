import { displayStockTransfer, transferStock } from "@/services/serverside_api_service/user/stock/stockService";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

// tranfer stock from warehouse to warehouse / office
export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();    
    const userId = req.headers.get("x-user-id");
    if (userId) {
      const { success } = await transferStock(data,userId);
      return NextResponse.json({ success }, { status: STATUS.SUCCESS.code });
    } else
      return NextResponse.json(
        { message: STATUS.FORBIDDEN.message },
        { status: STATUS.FORBIDDEN.code }
      );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.UNAUTHORIZED.code }
    );
  }
};
// showing all transfered stock from vehicle to vehicle/godown/office
export const GET = async (req: NextRequest) => {
  try {
    const userId = req.headers.get("x-user-id");
    if (userId) {
      // const { success, result } = await getTransferedView(userId);
      const {success,viewData} = await displayStockTransfer()
      return NextResponse.json(
        { success, data: viewData },
        { status: STATUS.SUCCESS.code }
      );
    } else return NextResponse.json({}, { status: STATUS.UNAUTHORIZED.code });
  } catch (error) {
    return NextResponse.json(
      { message: STATUS.SERVER_ERROR.message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};
