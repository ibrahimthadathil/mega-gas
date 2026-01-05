import {
  deleteWarehouse,
  editWareHouseById,
} from "@/services/serverside_api_service/user/warehouse/wareHouseService";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await context.params;
    const data = await req.json();
    const { success, message } = await editWareHouseById(data);
    if (success)
      return NextResponse.json(
        { success, message },
        { status: STATUS.SUCCESS.code }
      );
    else
      return NextResponse.json(
        { success, message: STATUS.FORBIDDEN.message },
        { status: STATUS.FORBIDDEN.code }
      );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = await params;
    const { success, message } = await deleteWarehouse(id);
    if (success)
      return NextResponse.json(
        { message, success },
        { status: STATUS.SUCCESS.code }
      );
    else
      return NextResponse.json(
        { message: STATUS.FORBIDDEN.message },
        { status: STATUS.FORBIDDEN.code }
      );
  } catch (error) {
    return NextResponse.json(
      { message: STATUS.SERVER_ERROR.message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};
