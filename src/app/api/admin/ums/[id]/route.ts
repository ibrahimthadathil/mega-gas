import {
  delete_user,
  editUser,
} from "@/services/serverside_api_service/admin/ums-service.ts/ums-service";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await context.params;
    const success = await delete_user(id);
    if (success)
      return NextResponse.json({ success }, { status: STATUS.SUCCESS.code });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};

export const PUT = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await context.params;
    const data = await req.json();
    const { success,message } = await editUser(id, data);
    if (success)
      return NextResponse.json({ success,message }, { status: STATUS.CREATED.code });
    else return NextResponse.json({}, { status: STATUS.UNAUTHORIZED.code });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};
