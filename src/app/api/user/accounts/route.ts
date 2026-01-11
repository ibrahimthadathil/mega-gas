import { getAuthUser } from "@/lib/auth/jwt";
import {
  createNewAccount,
  getAllAccounts,
} from "@/services/serverside_api_service/user/accounts/accountService";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    const { user, error: authError } = await getAuthUser();
    data.created_by = user?.id as string;
    if (user?.id) {
      const { success } = await createNewAccount(data);
      
      if (success)
        return NextResponse.json(
          { message: STATUS.CREATED.message },
          { status: STATUS.CREATED.code }
        );
    } else
      return NextResponse.json(
        { message: STATUS.UNAUTHORIZED },
        { status: STATUS.UNAUTHORIZED.code }
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
    const { success, result } = await getAllAccounts();
    if (success)
      return NextResponse.json(
        { data: result, message: STATUS.SUCCESS.message },
        { status: STATUS.SUCCESS.code }
      );
    else
      return NextResponse.json(
        { message: STATUS.NOT_FOUND.message },
        { status: STATUS.NOT_FOUND.code }
      );
  } catch (error) {}
};
