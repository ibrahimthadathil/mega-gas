import { getDeliverableProduct } from "@/services/serverside_api_service/user/sales/saleService";
import { STATUS } from "@/types/types";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
  const {success,product} =  await getDeliverableProduct()
  console.log(product,'💕');
  
  if(success) return NextResponse.json({data:product},{status:STATUS.SUCCESS.code})
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};
