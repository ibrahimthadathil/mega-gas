import { getAuthUser } from "@/lib/auth/jwt";
import {
  deleteSaleSlip,
  editSaleSlip,
  getSalesSlipByID,
} from "@/services/serverside_api_service/admin/sales/sale-admin-serivce";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = await params;
    const { user, error: authError } = await getAuthUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { message: "Unauthorized", error: authError },
        { status: STATUS.UNAUTHORIZED.code }
      );
    }

    const { message, success } = await deleteSaleSlip(user.id, id);
    if (success)
      return NextResponse.json(
        { success, message },
        { status: STATUS.SUCCESS.code }
      );
    else
      return NextResponse.json(
        { success, message },
        { status: STATUS.BAD_REQUEST.code }
      );
  } catch (error) {
    console.log((error as Error).message);

    return NextResponse.json(
      { message: STATUS.SERVER_ERROR.message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = await params;
    const { success, data, message } = await getSalesSlipByID(id);
    if (success)
      return NextResponse.json(
        { success, data },
        { status: STATUS.SUCCESS.code }
      );
    else
      return NextResponse.json(
        { message, success },
        { status: STATUS.NO_CONTENT.code }
      );
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
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
    const data = await req.json()
    
    const { user, error: authError } = await getAuthUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { message: "Unauthorized", error: authError },
        { status: STATUS.UNAUTHORIZED.code }
      );
    }

    const { success, message } = await editSaleSlip(data,user.id,id);
    if (success)
      return NextResponse.json(
        { success, data },
        { status: STATUS.SUCCESS.code }
      );
    else
      return NextResponse.json(
        { message, success },
        { status: STATUS.NO_CONTENT.code }
      );
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};
