import { add_User } from "@/services/admin/auth-service.ts/userService";
import { IUser } from "@/types/types";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const data = await req.json();

    if (data) {
      const { success } = await add_User(data);
      if (success)
        return NextResponse.json({ message: "user Reached" }, { status: 200 });
      else throw new Error("moonji");
    } else throw new Error("Failed to load the form data");
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
};
