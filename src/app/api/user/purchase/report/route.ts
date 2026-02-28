import { STATUS } from "@/types/types"
import { NextResponse } from "next/server"

export const GET = async()=>{
    try {
        
    } catch (error) {
        return NextResponse.json({message:STATUS.SERVER_ERROR.message},{status:STATUS.SERVER_ERROR.code})
    }
}