export const dynamic = "force-dynamic";
import { getAuthUser } from "@/lib/auth/jwt";
import { reportDailyDelivery } from "@/repository/user/sales/salesRepository";
import {
  addExpenses,
  getExpensesByUser,
} from "@/services/serverside_api_service/user/expenses/expensesService";
import { Expense, STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const data = (await req.json()) as Expense;
    const { user, error: authError } = await getAuthUser();
    data.created_by = user?.id as string;

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

export const GET = async (req: NextRequest) => {
  try { 
    const { user, error: authError } = await getAuthUser();
    if (user?.id) {
      const { success, data } = await getExpensesByUser(user?.id);
      if (success) {
        return NextResponse.json(
          { data, success },
          { status: STATUS.SUCCESS.code }
        );
      }
    } else throw new Error("Un-authorized");
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};
