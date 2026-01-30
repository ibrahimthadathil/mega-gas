import { getDasboardData } from "@/services/serverside_api_service/user/dashboard/dashboard-service";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";
import { InventoryFilters } from "@/types/inventory";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const filters: InventoryFilters = {
      warehouseNames: searchParams.get("warehouseNames")?.split(","),
      productNames: searchParams.get("productNames")?.split(","),
      startDate: searchParams.get("startDate") ?? undefined,
      endDate: searchParams.get("endDate") ?? undefined,
      page: searchParams.get("page")
        ? Number(searchParams.get("page"))
        : undefined,
      limit: searchParams.get("limit")
        ? Number(searchParams.get("limit"))
        : undefined,
    };

    const { count, data, message, products, success } = await getDasboardData(
      filters
    );

    if (success)
      return NextResponse.json(
        { data: data, products, success, count },
        { status: STATUS.SUCCESS.code }
      );
    else
      return NextResponse.json(
        { success, message },
        { status: STATUS.NO_CONTENT.code }
      );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: STATUS.SERVER_ERROR.message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};
