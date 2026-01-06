import {
  displayStockTransfer,
  getTransferedView,
  unloadSlipRegister,
} from "@/services/serverside_api_service/user/stock/stockService";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    const userId = req.headers.get("x-user-id");
    if (userId) {
      const { success } = await unloadSlipRegister(data, userId);
      return NextResponse.json({ success }, { status: STATUS.CREATED.code });
    } else return NextResponse.json({}, { status: STATUS.UNAUTHORIZED.code });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const userId = req.headers.get("x-user-id");
    if (userId) {
      // const { success, result } = await getTransferedView(userId);
      const {success,viewData} = await displayStockTransfer()
      return NextResponse.json(
        { success, data: viewData },
        { status: STATUS.CREATED.code }
      );
    } else return NextResponse.json({}, { status: STATUS.UNAUTHORIZED.code });
  } catch (error) {
    return NextResponse.json(
      { message: STATUS.SERVER_ERROR.message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};
