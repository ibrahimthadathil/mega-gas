import { userLoginService } from "@/services/user/authService/authService";
import { STATUS } from "@/types/types";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const data = await req.json();
    const {message,session,profile,success} = await userLoginService(data)    
    if(success)return NextResponse.json({ message , profile ,success}, { status: STATUS.SUCCESS.code });
    else return NextResponse.json({message},{status:STATUS.NOT_FOUND.code})
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.UNAUTHORIZED.code }
    );
  }
};
