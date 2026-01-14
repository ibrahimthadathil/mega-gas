import supabaseAdmin from "@/lib/supabase/supabaseAdmin";
import supabase from "@/lib/supabase/supabaseClient";

const add_product = async (payload: Record<string, unknown>) => {
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

const getEdit_Product = async (id: string) => {
  try {
    const { error, data } = await supabaseAdmin
      .from("materialized_products_cache")
      .select("*")
      .eq("id", id);
    if (error) throw error;
    return data;
  } catch (error) {
    throw (error as Error).message;
  }
};

const edit_Product = async (payload: Record<string, unknown>) => {
  try {
    const { error } = await supabaseAdmin.rpc(
      "update_product_with_components",
      payload
    );
    if (error) throw error;
    return true;
  } catch (error) {
    console.log((error as Error).message, "ssss");

    throw error;
  }
};

const get_All_cylinders = async () => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("id, product_name")
      .eq("product_type", "inventory")
      .eq("is_composite", false)
      .or("product_name.ilike.%FULL%,product_name.ilike.%EMPTY%");

    if (error) throw error;
    return data
  } catch (error) {
    console.log((error as Error).message);
  }
};
export {
  get_All_cylinders,
  add_product,
  getAll_products,
  getEdit_Product,
  edit_Product,
};
