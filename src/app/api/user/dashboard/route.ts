import { getDasboardData } from "@/services/serverside_api_service/user/dashboard/dashboard-service";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const { success, data, message } = await getDasboardData();
    console.log('💕💕💕',data);
    
    if (success)
      return NextResponse.json(
        { success, data, message },
        { status: STATUS.SUCCESS.code }
      );
    else  return NextResponse.json(
        { success, message },
        { status: STATUS.NO_CONTENT.code }
      );
  } catch (error) {
    return NextResponse.json(
      { message: STATUS.SERVER_ERROR.message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};
