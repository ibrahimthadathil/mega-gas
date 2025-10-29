import supabaseAdmin from "@/lib/supabase/supabaseAdmin";
import { add_User } from "@/services/admin/auth-service.ts/userService";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const data = await req.json();
    if (data) {
      const { success, message, status } = await add_User(data);
      if (success) return NextResponse.json({ success, message }, { status });
      else return NextResponse.json({ success, message }, { status });
    } else throw new Error("Failed to load the form data");
  } catch (error) {
    console.log((error as Error).message);

    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
};

export async function DELETE() {
  try {
    const { data } = await supabaseAdmin.auth.admin.listUsers();

    for (const user of data.users) {
      await supabaseAdmin.auth.admin.deleteUser(user.id);
    }
    return NextResponse.json({ message: "All auth users deleted ✅" });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Error deleting users" },
      { status: 500 }
    );
  }
}
