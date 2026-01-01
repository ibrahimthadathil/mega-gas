import { getAllUsers } from "@/services/serverside_api_service/admin/ums-service.ts/ums-service";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const { success, data } = await getAllUsers();
    if (success)
      return NextResponse.json({ data }, { status: STATUS.SUCCESS.code });
    else
      return NextResponse.json(
        { message: STATUS.NOT_FOUND.message },
        { status: STATUS.NOT_FOUND.code }
      );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.UNAUTHORIZED.code }
    );
  }
};
