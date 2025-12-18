import { getDeliverableProduct, recordDelivery } from "@/services/serverside_api_service/user/sales/saleService";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
  const {success,product} =  await getDeliverableProduct()  
  if(success) return NextResponse.json({data:product},{status:STATUS.SUCCESS.code})
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};

export const POST = async (req:NextRequest)=>{
  try {
    const payload = await req.json()
    console.log(payload);
    
    await recordDelivery(payload)
    return NextResponse.json({message:'created'},{status:STATUS.CREATED.code})
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.SERVER_ERROR.code }
    );
    }
    
  }

