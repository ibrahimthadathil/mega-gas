import { getAuthUser } from "@/lib/auth/jwt";
import {
  addPurchase_Register,
  getPlantLoadRegister,
} from "@/services/serverside_api_service/user/purchase/purchaseService";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    const { user, error: authError } = await getAuthUser();
    if (user?.id) {
      const { success } = await addPurchase_Register(data, user?.id);
      return NextResponse.json({ success }, { status: STATUS.CREATED.code });
    } else return NextResponse.json({}, { status: STATUS.UNAUTHORIZED.code });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.SERVER_ERROR.code },
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const { user, error: authError } = await getAuthUser();

    if (!user?.id) {
      return NextResponse.json({}, { status: STATUS.UNAUTHORIZED.code });
    }
    const searchParams = req.nextUrl.searchParams;
    
    const { data, success, total, totalPages } = await getPlantLoadRegister(
      user.id,
      {
        startDate: searchParams.get("startDate") || undefined,
        endDate: searchParams.get("endDate") || undefined,
        warehouse: searchParams.get("warehouse") || undefined,
        isUnloaded: searchParams.get("isUnloaded") || undefined,
        page: parseInt(searchParams.get("page") || "1"),
        limit: parseInt(searchParams.get("limit") || "10"),
      },
    );
    return NextResponse.json(
      {
        data,
        success,
        total,
        page: parseInt(searchParams.get("page") || "1"),
        totalPages,
      },
      { status: STATUS.SUCCESS.code },
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.SERVER_ERROR.code },
    );
  }
};
