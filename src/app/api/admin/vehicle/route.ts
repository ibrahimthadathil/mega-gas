import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req:NextRequest) => {
    try {
        const data = req.json()
        console.log(data);
        return NextResponse.json({},{status:200})
    } catch (error) {
         return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.UNAUTHORIZED.code }
    );
    }
};
