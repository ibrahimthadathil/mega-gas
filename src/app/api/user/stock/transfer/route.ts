import { transferStock } from "@/services/serverside_api_service/user/stock/stockService";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    console.log(data);
    
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
