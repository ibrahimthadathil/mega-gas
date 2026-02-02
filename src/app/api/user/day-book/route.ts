import { getDayBookDetails } from "@/services/serverside_api_service/user/day-book/day-book-service";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req:NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const filter = {
         date : searchParams.get('date')??undefined,
         chest : searchParams.get('chest')??undefined,
         status : searchParams.get('status')??undefined,
    }
    const { success, data, message } = await getDayBookDetails(filter);
    
    if (success)
      return NextResponse.json(
        { success, data, message },
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
