import { addVehicle } from "@/services/serverside_api_service/admin/vehicle/vehicle-service";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    const userId = req.headers.get("x-user-id");
    data.created_by = userId;
    const { success } = await addVehicle(data);
    if (success) return NextResponse.json({ success }, { status: 200 });
    else
      return NextResponse.json(
        { success: false },
        { status: STATUS.SERVER_ERROR.code }
      );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.UNAUTHORIZED.code }
    );
  }
};
