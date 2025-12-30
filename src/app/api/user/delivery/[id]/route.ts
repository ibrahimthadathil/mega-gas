import { getDeliveryPayload } from "@/services/serverside_api_service/user/sales/saleService";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const authId = req.headers.get("x-user-id");
    if (authId) {
      const { id } = await params;
      const data = await getDeliveryPayload(id, authId);
      console.log(JSON.stringify( data.data.customers));
      
      return NextResponse.json({data}, { status: STATUS.SUCCESS.code });
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
