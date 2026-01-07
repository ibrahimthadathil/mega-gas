import {
  deleteTransferStock,
  EditStockTranfer,
} from "@/services/serverside_api_service/user/stock/stockService";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";
// delete function for stock tranfer which is already deleted
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = await params;
    const { message, success } = await deleteTransferStock(id);
    if (success)
      return NextResponse.json(
        { success, message },
        { status: STATUS.SUCCESS.code }
      );
    else
      return NextResponse.json(
        { success, message },
        { status: STATUS.BAD_REQUEST.code }
      );
  } catch (error) {
    return NextResponse.json(
      { message: STATUS.SERVER_ERROR.message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};

// edit stock tranfer

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const data = await req.json();
    const { id } = await params;
    const authId = req.headers.get("x-user-id");
    if (authId) {
      const { message, success } = await EditStockTranfer(authId, id, data);
      if (success)
        return NextResponse.json(
          { success, message },
          { status: STATUS.SUCCESS.code }
        );
      else
        return NextResponse.json(
          { success, message },
          { status: STATUS.BAD_REQUEST.code }
        );
    } else
      return NextResponse.json(
        { message: STATUS.UNAUTHORIZED.message },
        { status: STATUS.UNAUTHORIZED.code }
      );
  } catch (error) {
    return NextResponse.json(
      { message: STATUS.SERVER_ERROR.message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};
