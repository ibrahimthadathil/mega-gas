import supabaseAdmin from "@/lib/supabase/supabaseAdmin";
import { IUser } from "@/types/types";

const creatUserAuth = async (email: string, password: string) => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    if (error) throw error;

    return data.user;
  } catch (error) {
    console.log((error as Error).message);
    throw error;
  }
};

const createUserProfile = async (user: IUser | { auth_id: string }) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .insert(user)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.log((error as Error).message);
    throw error;
  }
};

const findByEmail = async (email: string) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email)
      .single();
    if (error) throw error;
    return data;
  } catch (error) {}
};

export { creatUserAuth, createUserProfile, findByEmail };
