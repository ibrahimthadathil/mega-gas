import { reportDailyDelivery } from "@/repository/user/sales/salesRepository";
import {
  getDeliverableProduct,
  recordDelivery,
} from "@/services/serverside_api_service/user/sales/saleService";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    const { success, product } = await getDeliverableProduct();
    if (success)
      return NextResponse.json(
        { data: product },
        { status: STATUS.SUCCESS.code }
      );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const authId = req.headers.get("x-user-id");
    const payload = await req.json();
    if (authId) {
      const { success } = await recordDelivery(payload, authId as string);
      return NextResponse.json(
        { success, message: "created" },
        { status: STATUS.CREATED.code }
      );
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
