import { getAuthUser } from "@/lib/auth/jwt";
import { reportDailyDelivery } from "@/repository/user/sales/salesRepository";
import {
  dailyReport,
  getDeliverableProduct,
  recordDelivery,
} from "@/services/serverside_api_service/user/sales/saleService";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

// export const GET = async () => {
//   try {
//     const { success, product } = await getDeliverableProduct();
//     if (success)
//       return NextResponse.json(
//         { data: product },
//         { status: STATUS.SUCCESS.code }
//       );
//   } catch (error) {
//     return NextResponse.json(
//       { error: (error as Error).message },
//       { status: STATUS.SERVER_ERROR.code }
//     );
//   }
// };

export const POST = async (req: NextRequest) => {
  try {
    const { user, error: authError } = await getAuthUser();
    const payload = await req.json();
    if (user?.id) {
      const { success } = await recordDelivery(payload, user?.id as string);
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

export const GET = async (req: NextRequest) => {
  try {
    const { user, error: authError } = await getAuthUser();
    const { success, data, message } = await dailyReport(user?.id as string);
    if (success)
      return NextResponse.json(
        { success, data },
        { status: STATUS.SUCCESS.code }
      );
    else
      return NextResponse.json(
        { success, message,data:[] },
        { status: STATUS.NO_CONTENT.code }
      );
  } catch (error) {
    return NextResponse.json(
      { message: STATUS.SERVER_ERROR.message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};
