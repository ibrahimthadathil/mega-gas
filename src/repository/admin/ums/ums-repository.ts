import supabaseAdmin from "@/lib/supabase/supabaseAdmin";
import { IUser } from "@/types/types";

const get_All_User = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .order("user_name", { ascending: true });
    if (error) throw error;
    return data;
  } catch (error) {
    console.log((error as Error).message);
    throw error;
  }
};

const remove_User = async (authId: string, userId: string) => {
  try {
    const { error: userError } = await supabaseAdmin
      .from("users")
      .delete()
      .eq("id", userId);

    if (userError) throw userError;
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
      authId
    );
    if (authError) throw authError;
    return { success: true };
  } catch (error) {
    console.log((error as Error).message);
    throw error;
  }
};

const edit_user = async (user: IUser, userId: string) => {
  try {
    if (user.password) {
      const { error: authError } =
        await supabaseAdmin.auth.admin.updateUserById(user.auth_id as string, {
          password: user.password,
        });
      if (authError) {
        throw authError;
      }
    }
    const { password, auth_id, ...rest } = user;
    if (user && Object.keys(user).length > 0) {
      const { error: userError } = await supabaseAdmin
        .from("users")
        .update(rest)
        .eq("id", userId);
      if (userError) throw userError;
    }

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    console.log((error as Error).message);
    throw error;
  }
};

export { get_All_User, remove_User, edit_user };
