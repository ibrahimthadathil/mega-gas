import { getAllSalesReports } from "@/services/serverside_api_service/admin/sales/sale-admin-serivce";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest) => {
  try {
    const { success, data, message } = await getAllSalesReports()
    if (success)
      return NextResponse.json(
        { success, data },
        { status: STATUS.SUCCESS.code }
      );
    else
      return NextResponse.json(
        { message, success },
        { status: STATUS.NO_CONTENT.code }
      );
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};
