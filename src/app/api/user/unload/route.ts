import { getAllUnloadDetails } from "@/services/serverside_api_service/user/unload/unload-service";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const { success, data, message } = await getAllUnloadDetails();    
    if (success)
      return NextResponse.json(
        { success, data },
        { status: STATUS.SUCCESS.code }
      );
    else
      return NextResponse.json(
        { success, message },
        { status: STATUS.NOT_FOUND.code }
      );
  } catch (error) {
    return NextResponse.json(
      { message: STATUS.SERVER_ERROR.message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};
