import { AuthRequest } from "@/middleware";
import { addExpenses } from "@/services/serverside_api_service/user/expenses/expensesService";
import { Expense, STATUS } from "@/types/types";
import { STATUS_CODES } from "http";
import { NextResponse } from "next/server";

export const POST = async (req: AuthRequest) => {
  try {
    const data = (await req.json()) as Expense;
    const userId = req.headers.get("x-user-id");
    data.created_by = userId as string;

    if (data.created_by) {
      const success = await addExpenses(data);
      if (success)
        return NextResponse.json(
          { message: "Expense Added", success: true },
          { status: STATUS.CREATED.code }
        );
    } else
      return NextResponse.json(
        { message: STATUS.BAD_REQUEST.message },
        { status: STATUS.BAD_REQUEST.code }
      );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};
