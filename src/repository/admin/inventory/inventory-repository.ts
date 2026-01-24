import supabaseAdmin from "@/lib/supabase/supabaseAdmin";

const getAllInventory = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from("inventory_qty_by_date_warehouse_product") // change this to "current_inventory_levels" table later
      .select("*");
    if (error) throw error;
    return data;
  } catch (error) {
    console.log((error as Error).message);

    throw error;
  }
};

export { getAllInventory };
