import { getAllSalesReports } from "@/services/serverside_api_service/admin/sales/sale-admin-serivce";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

// export const GET = async (
//   req: NextRequest) => {
//   try {
//     const { success, data, message } = await getAllSalesReports()
//     if (success)
//       return NextResponse.json(
//         { success, data },
//         { status: STATUS.SUCCESS.code }
//       );
//     else
//       return NextResponse.json(
//         { message, success },
//         { status: STATUS.NO_CONTENT.code }
//       );
//   } catch (error) {
//     return NextResponse.json(
//       { message: (error as Error).message },
//       { status: STATUS.SERVER_ERROR.code }
//     );
//   }
// };

export const GET = async (req: NextRequest) => {
  try {
    // Extract query parameters
    const searchParams = req.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');
    const warehouse = searchParams.get('users');
    const chest = searchParams.get('chest');

    // Pass filters to the database function
    const { success, data, message } = await getAllSalesReports({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      status: status || undefined,
      warehouse: warehouse || undefined,
      chest: (chest ?? "office") as "office" | "godown"

    });

    if (success) {
      return NextResponse.json(
        { success, data },
        { status: STATUS.SUCCESS.code }
      );
    } else {
      return NextResponse.json(
        { message, success },
        { status: STATUS.NO_CONTENT.code }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};