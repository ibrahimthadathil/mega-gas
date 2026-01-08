import { getInventoryStatus } from "@/services/serverside_api_service/admin/inventory-service/inventory-service";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const { data, success, message } = await getInventoryStatus();
    if (success)
      return NextResponse.json(
        { data, success },
        { status: STATUS.SUCCESS.code }
      );
    else
      return NextResponse.json(
        { success, message },
        { status: STATUS.NOT_FOUND.code }
      );
  } catch (error) {
    return NextResponse.json(
      { message: STATUS.SERVER_ERROR.message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};
