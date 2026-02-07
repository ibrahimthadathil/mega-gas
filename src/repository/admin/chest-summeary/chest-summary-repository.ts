import supabase from "@/lib/supabase/supabaseClient";

const get_ALL_chest_SUmmery = async (filter?: {
  status?: "settled" | "submitted";
  chest?: "office" | "godown";
}) => {
  let query = supabase
    .from("cash_chest_summary")
    .select("*");

  if (filter?.status) {
    query = query.eq("status", filter.status);
  }

  if (filter?.chest) {
    query = query.eq("chest_name", filter.chest);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data;
};

const add_cash_adjustment = async (payload: any) => {
  try {
    const {error} = await supabase.from("cash_chest").insert(payload);
    if(error) throw error
    return true
  } catch (error) {
    console.log((error as Error).message);
    throw error;
  }
};


export { get_ALL_chest_SUmmery,add_cash_adjustment };
