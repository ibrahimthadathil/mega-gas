import { delete_Vehicle } from "@/services/serverside_api_service/admin/vehicle/vehicle-service";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = await params;
    console.log(id);
    
    const userId = req.headers.get("x-user-id") as string;
    if (userId) {
      const success = await delete_Vehicle(id);
      if (success) {
        return NextResponse.json({ success }, { status: STATUS.SUCCESS.code });
      }
    } else throw new Error("Un-authorized");
  } catch (error) {
    console.log((error as Error).message, "ererer");

    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};
