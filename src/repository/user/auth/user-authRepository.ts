import supabase from "@/lib/supabase/supabaseClient";

const userLogIn = async (email: string, password: string) => {
  try {
    const { data, error: autherror } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (autherror) return {success:false , message: autherror.code };
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", data.user.id)
      .single();
    if (profileError)return { success:false , message:profileError.code}
    return {success:true ,session:data.session,profile}
  } catch (error) {
    console.log((error as Error).message);
    throw error;
  }
};

export { userLogIn };
