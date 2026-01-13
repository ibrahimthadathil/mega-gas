import supabaseAdmin from "@/lib/supabase/supabaseAdmin";

const getAllInventory = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from("inventory_qty_by_date_warehouse_product")
      .select("*");
    if (error) throw error;
    console.log(data);
    
    return data;
  } catch (error) {
    console.log((error as Error).message);

    throw error;
  }
};

export { getAllInventory };
