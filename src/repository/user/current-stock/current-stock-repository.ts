import supabase from "@/lib/supabase/supabaseClient";

const show_the_product_qty_by_product = async (
  warehouseid: string,
  products: string[],
) => {
  try {
    const { data, error } = await supabase
      .from("current_inventory_levels")
      .select("product_name, qty")
      .eq("warehouse_id", warehouseid)
      .in("product_id", products);
    if (error) throw error;
    return data;
  } catch (error) {
    console.log((error as Error).message);
    throw error;
  }
};

export {show_the_product_qty_by_product}
