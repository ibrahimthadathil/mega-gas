import { getAuthUser } from "@/lib/auth/jwt";
import { getSalesReportSlipById } from "@/services/serverside_api_service/user/sales/saleService";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async ( req: NextRequest,
  { params }: { params: { id: string }}) => {
  try {
    
    const { id } = await params;
    const warehouse = ''
    const { user, error: authError } = await getAuthUser();
    if(!user) throw authError
    const { success, data, message } = await getSalesReportSlipById(id,warehouse);
    console.log(data);
    
     if (success)
      return NextResponse.json(
        { success, data },
        { status: STATUS.SUCCESS.code }
      );
    else
      return NextResponse.json(
        { message, success },
        { status: STATUS.NO_CONTENT.code }
      )
  } catch (error) {
    console.log((error as Error).message);
    
    return NextResponse.json(
      { message: STATUS.SERVER_ERROR.message },
      { status: STATUS.SERVER_ERROR.code },
    );
  }
};
