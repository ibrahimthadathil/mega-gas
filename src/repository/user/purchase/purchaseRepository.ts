import supabase from "@/lib/supabase/supabaseClient";

const addPurchaseRegister = async (payload : Record<string,Object>) => {
  try {
    const { data, error } = await supabase.rpc(
      "create_plant_load_with_lines",
      payload
    );
    if (error) throw error;
    return true
  } catch (error) {
    console.log((error as Error).message);
    throw (error as Error).message;
  }
};

const getMaterializedProduct = async () => {
  try {
    const { data, error } = await supabase
      .from("materialized_products_cache")
      .select("*");
    if (error) throw error;
    return data;
  } catch (error) {
    throw (error as Error).message;
  }
};

export { addPurchaseRegister, getMaterializedProduct };
