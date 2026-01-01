import supabase from "@/lib/supabase/supabaseClient";

const checkUserByAuthId = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", userId)
      .single();
    if (error) throw error;
    else return data;
  } catch (error) {
    throw error;
  }
};

const findUserById = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId).single();
    if (error) throw error;
    return data; 
  } catch (error) {
    console.log((error as Error).message);

    throw error;
  }
};

const getUserByRole = async (role: string) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("role", role);
    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};

export { checkUserByAuthId, getUserByRole, findUserById };
