import supabaseAdmin from "@/lib/supabase/supabaseAdmin";

const get_ALL_chest_SUmmery = async (filter?: {
  status?: "settled" | "submitted";
  chest?: "office" | "godown";
}) => {
  let query = supabaseAdmin
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

export { get_ALL_chest_SUmmery };
