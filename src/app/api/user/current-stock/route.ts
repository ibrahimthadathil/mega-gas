import { getQtyByProductAndWarehouse } from "@/services/serverside_api_service/user/current-stock/current-stock-service";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    
    const searchParams = req.nextUrl.searchParams;
    const warehouseId = searchParams.get("warehouseId") as string;
    const products = searchParams.getAll("products[]");

    const { success, message, stockQty } = await getQtyByProductAndWarehouse({
      warehouseId,
      products,
    });    
    if (success)
      return NextResponse.json(
        { success, message, data:stockQty },
        { status: STATUS.SUCCESS.code },
      );
    else
      return NextResponse.json(
        { success, message },
        { status: STATUS.BAD_REQUEST.code },
      );
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: STATUS.SERVER_ERROR.code },
    );
  }
};
