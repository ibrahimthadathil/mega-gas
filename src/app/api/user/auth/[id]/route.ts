import { get_UserByRole } from "@/services/serverside_api_service/user/authService/authService";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await context.params;
    const { success, result } = await get_UserByRole(id);
    if (success) {
      return NextResponse.json(
        { data: result, success },
        { status: STATUS.SUCCESS.code }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.UNAUTHORIZED.code }
    );
  }
};
