import { deleteAccountById, updateAccountById } from "@/services/serverside_api_service/user/accounts/accountService";
import { STATUS } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req:NextRequest,{params}:{params:{id:string}}) => {
  try {
    const {id} = await  params
    const {success} = await deleteAccountById(id);
    if (success) {
      return NextResponse.json({ success }, { status: STATUS.SUCCESS.code });
    } else {
      return NextResponse.json({ message: STATUS.BAD_REQUEST.message }, { status: STATUS.BAD_REQUEST.code });
    }
  } catch (error) {
    return NextResponse.json(
      { message: STATUS.SERVER_ERROR.message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
};

export const PUT = async (req:NextRequest,{params}:{params:{id:string}}) => {
  try {
    const {id} = await params
    const payload = await req.json()
    const {success,message} = await updateAccountById(id,payload);
    if (success) {
      return NextResponse.json({ success,  message }, { status: STATUS.SUCCESS.code });
    } else {
      return NextResponse.json({ message: STATUS.BAD_REQUEST.message }, { status: STATUS.BAD_REQUEST.code });
    }
  } catch (error) {
    return NextResponse.json(
      { message: STATUS.SERVER_ERROR.message },
      { status: STATUS.SERVER_ERROR.code }
    );
  }
}