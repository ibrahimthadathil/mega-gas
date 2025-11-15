import supabase from "@/lib/supabase/supabaseClient";

const checkUserByAuthId = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", userId)
      .single()
      if(error) throw error
      else return data
  } catch (error) {    
    throw error
  }
};

export { checkUserByAuthId };
