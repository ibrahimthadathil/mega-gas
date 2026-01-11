import { getAuthUser } from "@/lib/auth/jwt";
import { addVehicle, show_vehicles } from "@/services/serverside_api_service/admin/vehicle/vehicle-service";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    const { user, error: authError } = await getAuthUser();
    data.created_by = user?.id;
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


export const GET = async (req:NextRequest) => {
  try {
    const { user, error: authError } = await getAuthUser();
    if(!user?.id) throw Error('Un-authorized')
      const {result,success} = await show_vehicles()
    if(success) return NextResponse.json({success,data:result},{status:STATUS.SUCCESS.code})
  } catch (error) {
     return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.UNAUTHORIZED.code }
    );
  }
}