import supabaseAdmin from "@/lib/supabase/supabaseAdmin";

const getAllInventory = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from("current_inventory_levels")
      .select("*");

    if (error) throw error;

    return data;
  } catch (error) {
    console.log((error as Error).message);

    throw error;
  }
};

export { getAllInventory };
