import {
  editProduct,
  getEditProduct,
} from "@/services/serverside_api_service/admin/product/product-service";
import { IProduct, STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await context.params;
    const userId = req.headers.get("x-user-id");
    if (userId) {
      const { success, data } = await getEditProduct(id, userId);
      if (success)
        return NextResponse.json(
          { success, data },
          { status: STATUS.SUCCESS.code }
        );
      else throw new Error("Failed to fetch");
    } else return NextResponse.json({}, { status: STATUS.UNAUTHORIZED.code });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};

export const PUT = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await context.params;
    console.log("!!!!!", id);
    const userId = req.headers.get("x-user-id");
    const updateData = await req.json();
    if (userId && updateData) {
      const {success} = await editProduct(id, userId, updateData);
      if (success)
        return NextResponse.json({success}, { status: STATUS.SUCCESS.code });
      else throw new Error("Failed to update");
    } else return NextResponse.json({}, { status: STATUS.UNAUTHORIZED.code });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};
