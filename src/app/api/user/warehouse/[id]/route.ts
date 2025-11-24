import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest,{params}:{params:{id:string}})=>{
  try {
    const {id} = await params;
    const data = await req.json()
    console.log('@@@',id,data);
    return NextResponse.json({},{status:200})
  } catch (error) {
      return NextResponse.json(
          { error: (error as Error).message },
          { status: STATUS.SERVER_ERROR.code }
        );
  }
}