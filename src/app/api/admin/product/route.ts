import {
  addNewProduct,
  getAllProducts,
} from "@/services/serverside_api_service/admin/product/product-service";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    const userId = req.headers.get("x-user-id");
    if (!userId) throw new Error("Un-authorized");
    const { success } = await addNewProduct(data, userId);
    if (success) return NextResponse.json({success}, { status: STATUS.CREATED.code });
    else return NextResponse.json({success}, { status: STATUS.BAD_REQUEST.code });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.UNAUTHORIZED.code }
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const { success, data } = await getAllProducts();    
    if (success)
      return NextResponse.json(
        { data, success },
        { status: STATUS.SUCCESS.code }
      );
    else
      return NextResponse.json({ data: [] }, { status: STATUS.SUCCESS.code });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};
