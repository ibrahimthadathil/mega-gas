import { deleteTransactionAccount, editTransaction } from "@/services/serverside_api_service/user/accounts/transaction/transactionService";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = await params;
    console.log(id);

    const { success } = await deleteTransactionAccount(id);
    if (success)
      return NextResponse.json(
        { success, message: "Deleted" },
        { status: STATUS.SUCCESS.code }
      );
    else throw Error("Try later");
  } catch (error) {
    return NextResponse.json(
      { Message: STATUS.SERVER_ERROR.message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = await params;
    const UserId = "5ba724f3-e625-4b82-912c-5f7a080263c9";
    const updatedTransaction = await req.json();
    const { success } = await editTransaction(id, updatedTransaction, UserId);
    if (success) {
      return NextResponse.json(
        { message: STATUS.SUCCESS.message, success },
        { status: STATUS.SUCCESS.code }
      );
    } else
      return NextResponse.json(
        { message: STATUS.BAD_REQUEST.message },
        { status: STATUS.BAD_REQUEST.code }
      );
  } catch (error) {
    return NextResponse.json(
      { Message: STATUS.SERVER_ERROR.message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};
