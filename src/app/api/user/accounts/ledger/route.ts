import { getLedger } from "@/services/serverside_api_service/user/accounts/transaction/transactionService";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const filter = {
      account: searchParams.get("account") ?? undefined,
      month: Number(searchParams.get("month")) ?? new Date().getMonth() + 1,
      year: Number(searchParams.get("year")) ?? new Date().getFullYear(),
    };
    const { data, message, success } = await getLedger(filter);
    if(success)return NextResponse.json({data,success},{status:STATUS.SUCCESS.code})
    else return NextResponse.json({success,message},{status:STATUS.NOT_FOUND.code})  
  } catch (error) {
    return NextResponse.json(
      { message: STATUS.SERVER_ERROR.message },
      { status: STATUS.SERVER_ERROR.code },
    );
  }
};
