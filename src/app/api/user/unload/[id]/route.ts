import { getAuthUser } from "@/lib/auth/jwt";
import {
  deleteUnloadSlipById,
  editUnloadSlip,
  getunloadData,
} from "@/services/serverside_api_service/user/unload/unload-service";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  try {
    const { id } = await params;

    const { user, error: authError } = await getAuthUser();
    const { message, success } = await deleteUnloadSlipById(
      id,
      user?.id as string,
    );
    if (success)
      return NextResponse.json(
        { success, message },
        { status: STATUS.SUCCESS.code },
      );
    else
      return NextResponse.json(
        { success, message },
        { status: STATUS.BAD_REQUEST.code },
      );
  } catch (error) {
    return NextResponse.json(
      { message: STATUS.SERVER_ERROR.message },
      { status: STATUS.SERVER_ERROR.code },
    );
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  try {
    const { id } = await params;
    const data = await req.json();
    const { succes, message } = await editUnloadSlip(data,id);
    return NextResponse.json(
      { succes, message },
      { status: STATUS.SUCCESS.code },
    );
  } catch (error) {
    return NextResponse.json(
      { message: STATUS.SERVER_ERROR.message },
      { status: STATUS.SERVER_ERROR.code },
    );
  }
};

export const GET = async(
   req: NextRequest,
  { params }: { params: { id: string } },
) =>{
  try {
      const { user, error: authError } = await getAuthUser();
    if (user?.id) {
      const { id } = await params;
      const {result,success} = await getunloadData(id);                  
      return NextResponse.json({data:result,success}, { status: STATUS.SUCCESS.code });
    } else
      return NextResponse.json(
        { message: STATUS.FORBIDDEN.message },
        { status: STATUS.FORBIDDEN.code }
      );
  } catch (error) {
     return NextResponse.json(
      { message: STATUS.SERVER_ERROR.message },
      { status: STATUS.SERVER_ERROR.code },
    );
  }
}
