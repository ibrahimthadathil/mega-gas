import {
  addPurchase_Register,
  getPlantLoadRegister,
} from "@/services/serverside_api_service/user/purchase/purchaseService";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    const userId = req.headers.get("x-user-id") as string;
    if (userId) {
      const { success } = await addPurchase_Register(data, userId);
      return NextResponse.json({ success }, { status: STATUS.CREATED.code });
    } else return NextResponse.json({}, { status: STATUS.UNAUTHORIZED.code });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const authId = req.headers.get("x-user-id") as string;
    if (authId) {
      const { data, success } = await getPlantLoadRegister(authId);
      console.log(data[0]);
      
      return NextResponse.json(
        { data, success },
        { status: STATUS.SUCCESS.code }
      );
    } else return NextResponse.json({}, { status: STATUS.UNAUTHORIZED.code });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};
