export const dynamic = "force-dynamic";
import { clear_Expense } from "@/services/serverside_api_service/user/expenses/expensesService";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = await params;
    const userId = req.headers.get("x-user-id") as string;
    if (userId) {
      const success = await clear_Expense(id);
      if (success) {
        return NextResponse.json({ success }, { status: STATUS.SUCCESS.code });
      }
    } else throw new Error("Un-authorized");
  } catch (error) {
    console.log((error as Error).message, "ererer");

    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};
