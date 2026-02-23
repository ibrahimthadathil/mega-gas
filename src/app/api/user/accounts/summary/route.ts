import { accountSummary } from "@/services/serverside_api_service/user/accounts/transaction/transactionService";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const { success, data, message } = await accountSummary();
    if (success)
      return NextResponse.json(
        { success, data },
        { status: STATUS.SUCCESS.code },
      );
    else
      return NextResponse.json(
        { success, message },
        { status: STATUS.SUCCESS.code },
      );
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: STATUS.SERVER_ERROR.code },
    );
  }
};
