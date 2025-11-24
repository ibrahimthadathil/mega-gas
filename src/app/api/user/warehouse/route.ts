import {
  AddNewWareHouse,
  getWareHouses,
} from "@/services/serverside_api_service/user/warehouse/wareHouseService";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    const userId = req.headers.get("x-user-id");
    data.created_by = userId as string;
    const success = await AddNewWareHouse(data);
    if (success)
      return NextResponse.json({ success }, { status: STATUS.CREATED.code });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};
export const GET = async () => {
  try {
    const { success, data } = await getWareHouses();
    if (success)
      return NextResponse.json(
        { success, data },
        { status: STATUS.SUCCESS.code }
      );
    else
      return NextResponse.json({ success }, { status: STATUS.NOT_FOUND.code });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};

