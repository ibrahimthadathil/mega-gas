import { getDeliveryPayloadByVehicle } from "@/repository/user/sales/salesRepository";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(req:NextRequest,{params}:{params:{id:string}})=>{
    try {
      
        const {id} = await params
       const data = await getDeliveryPayloadByVehicle(id)
       if(!data) throw new Error('')
       return NextResponse.json({data},{status:STATUS.SUCCESS.code})
    } catch (error) {
        return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.SERVER_ERROR.code }
    );
    } 
}