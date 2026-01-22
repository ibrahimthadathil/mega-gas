import { getAuthUser } from "@/lib/auth/jwt";
import {
  addPurchase_Register,
  getPlantLoadRegister,
} from "@/services/serverside_api_service/user/purchase/purchaseService";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    const { user, error: authError } = await getAuthUser();
    if (user?.id) {
      const { success } = await addPurchase_Register(data, user?.id);
      return NextResponse.json({ success }, { status: STATUS.CREATED.code });
    } else return NextResponse.json({}, { status: STATUS.UNAUTHORIZED.code });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.SERVER_ERROR.code },
    );
  }
};

// export const GET = async (req: NextRequest) => {
//   try {
//     const { user, error: authError } = await getAuthUser();
//     if (user?.id) {
//       const { data, success } = await getPlantLoadRegister(user?.id);
//       return NextResponse.json(
//         { data, success },
//         { status: STATUS.SUCCESS.code }
//       );
//     } else return NextResponse.json({}, { status: STATUS.UNAUTHORIZED.code });
//   } catch (error) {
//     return NextResponse.json(
//       { error: (error as Error).message },
//       { status: STATUS.SERVER_ERROR.code }
//     );
//   }
// };

export const GET = async (req: NextRequest) => {
  try {
    const { user, error: authError } = await getAuthUser();

    if (!user?.id) {
      return NextResponse.json({}, { status: STATUS.UNAUTHORIZED.code });
    }

    // Extract query parameters
    const searchParams = req.nextUrl.searchParams;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const warehouse = searchParams.get("warehouse");
    const isUnloaded = searchParams.get("isUnloaded");
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");

    // Pass filters to the database function
    const { data, success, total, totalPages } = await getPlantLoadRegister(
      user.id,
      {
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        warehouse: warehouse || undefined,
        isUnloaded: isUnloaded || undefined,
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 10,
      },
    );

    return NextResponse.json(
      {
        data,
        success,
        total,
        page: page ? parseInt(page) : 1,
        totalPages,
      },
      { status: STATUS.SUCCESS.code },
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.SERVER_ERROR.code },
    );
  }
};
