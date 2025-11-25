import supabaseAdmin from "@/lib/supabase/supabaseAdmin";

const add_product = async (payload: Record<string,unknown>) => {
  try {
    const { error } = await supabaseAdmin.rpc(
      "create_product_with_components",
      payload
    );
    if (error) throw error;
    return true;
  } catch (error) {
    console.log((error as Error).message);
    throw (error as Error).message;
  }
};

const getAll_products = async () => {
  try {
    const { data, error } = await supabaseAdmin.from("products").select("*");
    if (error) return error;
    return data;
  } catch (error) {
    console.log((error as Error).message);
    throw (error as Error).message;
  }
};

export { add_product, getAll_products };
