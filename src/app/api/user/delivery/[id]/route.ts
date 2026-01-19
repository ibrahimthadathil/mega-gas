import { getAuthUser } from "@/lib/auth/jwt";
import { getDeliveryPayload } from "@/services/serverside_api_service/user/sales/saleService";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {    
    const { user, error: authError } = await getAuthUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { message: "Unauthorized", error: authError },
        { status: STATUS.UNAUTHORIZED.code }
      );
    }

    
    if (authError || !user) {
      return NextResponse.json(
        { message: "Unauthorized", error: authError },
        { status: STATUS.UNAUTHORIZED.code }
      );
    }
    
    if (user?.id) {
      const { id } = await params;
      const data = await getDeliveryPayload(id, user.id);
      
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
