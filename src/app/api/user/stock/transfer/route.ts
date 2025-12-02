import { stock_Transfer } from "@/repository/user/stock/stockRepository";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req:NextRequest) => {
  try {
    console.log('ghjmk,');
    
    await stock_Transfer()
    return NextResponse.json({ message:'check console'}, { status: STATUS.SUCCESS.code });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.UNAUTHORIZED.code }
    );
  }
};
