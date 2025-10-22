import supabase from "@/lib/supabase/supabaseClient";

export const CheckuserExist = async (username: string, email: string) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .eq("email", email)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
