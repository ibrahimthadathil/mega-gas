import {
  delete_Vehicle,
  updateVehicle,
} from "@/services/serverside_api_service/admin/vehicle/vehicle-service";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await context.params;
    console.log(id);

    const userId = req.headers.get("x-user-id") as string;
    if (userId) {
      const success = await delete_Vehicle(id);
      if (success) {
        return NextResponse.json({ success }, { status: STATUS.SUCCESS.code });
      }
    } else throw new Error("Un-authorized");
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};

export const PUT = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    const updateData = await req.json();
    const { id } = await context.params;
    if (updateData && id) {
      const { success } = await updateVehicle(id, updateData);
      if (success)
        return NextResponse.json({ success }, { status: STATUS.SUCCESS.code });
      else return NextResponse.json({}, { status: STATUS.BAD_REQUEST.code });
    }
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};
