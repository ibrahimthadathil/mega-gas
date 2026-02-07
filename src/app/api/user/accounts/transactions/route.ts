import { getAuthUserFromCookies } from "@/lib/auth/jwt";
import {
  createNewTransaction,
  getAllTransaction,
} from "@/services/serverside_api_service/user/accounts/transaction/transactionService";
import { lineItemFilterProps } from "@/types/transaction ";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { user, error: authError } = await getAuthUserFromCookies();
    const newTransaction = await req.json();
    if (user) {
      const { success } = await createNewTransaction(newTransaction, user?.id);
      if (success) {
        return NextResponse.json(
          { message: STATUS.CREATED.message, success },
          { status: STATUS.CREATED.code },
        );
      } else
        return NextResponse.json(
          { message: STATUS.BAD_REQUEST.message },
          { status: STATUS.BAD_REQUEST.code },
        );
    }
    return NextResponse.json(
      { message: STATUS.UNAUTHORIZED.message },
      { status: STATUS.UNAUTHORIZED.code },
    );
  } catch (error) {
    return NextResponse.json(
      { message: STATUS.BAD_REQUEST.message },
      { status: STATUS.BAD_REQUEST.code },
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const filter: lineItemFilterProps & { page?: number; limit?: number } = {
      account_name: searchParams.get("account_name") ?? undefined,
      date: searchParams.get("date") ?? undefined,
      source_form: (searchParams.get("source_form") as any) ?? undefined,
      type: (searchParams.get("type") as any) ?? undefined,
      page: parseInt(searchParams.get("page") ?? "1"),
      limit: parseInt(searchParams.get("limit") ?? "10"),
    };
    const { success, data, total } = await getAllTransaction(filter);

    if (success)
      return NextResponse.json(
        { success, data, total, page: filter.page, limit: filter.limit },
        { status: STATUS.SUCCESS.code },
      );
    else return NextResponse.json({}, { status: STATUS.NOT_FOUND.code });
  } catch (error) {
    return NextResponse.json(
      { message: STATUS.BAD_REQUEST.message },
      { status: STATUS.BAD_REQUEST.code },
    );
  }
};
