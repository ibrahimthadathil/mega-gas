import { getPlantLoadCredential } from "@/services/serverside_api_service/user/purchase/purchaseService";
import { STATUS } from "@/types/types";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const { success, products, warehouse } = await getPlantLoadCredential();
    if(success) return NextResponse.json({success,data:[products,warehouse]})
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};
