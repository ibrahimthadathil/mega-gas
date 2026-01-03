import {
  createNewTransaction,
  getAllTransaction,
} from "@/services/serverside_api_service/user/accounts/transaction/transactionService";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const UserId = "5ba724f3-e625-4b82-912c-5f7a080263c9";
    const newTransaction = await req.json();
    const { success } = await createNewTransaction(newTransaction, UserId);
    if (success) {
      return NextResponse.json(
        { message: STATUS.CREATED.message, success },
        { status: STATUS.CREATED.code }
      );
    } else
      return NextResponse.json(
        { message: STATUS.BAD_REQUEST.message },
        { status: STATUS.BAD_REQUEST.code }
      );
  } catch (error) {
    return NextResponse.json(
      { message: STATUS.BAD_REQUEST.message },
      { status: STATUS.BAD_REQUEST.code }
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const { success, result } = await getAllTransaction();
    console.log(result);
    
    if (success)
      return NextResponse.json(
        { success, data: result },
        { status: STATUS.SUCCESS.code }
      );
    else return NextResponse.json({}, { status: STATUS.NOT_FOUND.code });
  } catch (error) {
    return NextResponse.json(
      { message: STATUS.BAD_REQUEST.message },
      { status: STATUS.BAD_REQUEST.code }
    );
  }
};
