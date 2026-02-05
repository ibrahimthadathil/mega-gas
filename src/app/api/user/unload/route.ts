import { getAllUnloadDetails } from "@/services/serverside_api_service/user/unload/unload-service";
import { STATUS } from "@/types/types";
import { UnloadFilters } from "@/types/unloadSlip";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const filter = {
      billDateFrom: searchParams.get("billDateFrom") ?? undefined,
      billDateTo: searchParams.get("billDateTo") ?? undefined,
      unloadDateFrom: searchParams.get("unloadDateFrom") ?? undefined,
      unloadDateTo: searchParams.get("unloadDateTo") ?? undefined,
      warehouseId: searchParams.get("warehouseId") ?? undefined,
      limit: parseInt(searchParams.get("limit") ?? "10"),
      page: parseInt(searchParams.get("page") ?? "1"),
    };
    console.log(filter,'from the route page');
    
    const { success, data, limit, page, total, totalPages, message } =
      await getAllUnloadDetails(filter);
    if (success)
      return NextResponse.json(
        { success, data: { data, limit, page, total, totalPages } },
        { status: STATUS.SUCCESS.code },
      );
    else
      return NextResponse.json(
        { success, message },
        { status: STATUS.NOT_FOUND.code },
      );
  } catch (error) {
    return NextResponse.json(
      { message: STATUS.SERVER_ERROR.message },
      { status: STATUS.SERVER_ERROR.code },
    );
  }
};
