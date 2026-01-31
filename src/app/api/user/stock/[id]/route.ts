
import { getAuthUser } from "@/lib/auth/jwt";
import { getDeliveryPayload } from "@/services/serverside_api_service/user/sales/saleService";
import { getunloadData } from "@/services/serverside_api_service/user/stock/stockService";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { user, error: authError } = await getAuthUser();
    if (user?.id) {
      const { id } = await params;
      const {result,success} = await getunloadData(id);
      console.log(JSON.stringify(result));
                  
      return NextResponse.json({data:result,success}, { status: STATUS.SUCCESS.code });
    } else
      return NextResponse.json(
        { message: STATUS.FORBIDDEN.message },
        { status: STATUS.FORBIDDEN.code }
      );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};
