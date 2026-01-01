import supabase from "@/lib/supabase/supabaseClient";

const addPurchaseRegister = async (payload: Record<string, unknown>) => {
  //   const payloads = {
  //   "p_register": {
  //     "sap_number": "PL-2025-0001",
  //     "bill_date": "2025-11-25",
  //     "created_by": "5ba724f3-e625-4b82-912c-5f7a080263c9",
  //     "created_at": "2025-11-25T08:30:00+00:00",
  //     "tax_invoice_number": "TINV-55555",
  //     "warehouse_id": "0343d705-ba8f-47bc-a49e-d1c8907efd5b"
  //   },
  //   "p_line_items": [
  // {
  //       "product_id": "5ad42421-df1d-4902-91d1-ae7af7123c15",
  //       "full_qty": 5,
  //       "trip_type": "oneway",
  //       "return_product_id": "18b9c107-3ee2-486f-bdb0-df895b5a40ee",
  //       "return_qty": 5,
  //       "created_by": "5ba724f3-e625-4b82-912c-5f7a080263c9",
  //       "created_at": "2025-11-25T08:32:00+00:00"
  //     },
  //     {
  //       "product_id": "5ad42421-df1d-4902-91d1-ae7af7123c15",
  //       "full_qty": 15,
  //       "trip_type": "two_way",
  //       "return_product_id": "18b9c107-3ee2-486f-bdb0-df895b5a40ee",
  //       "return_qty": 15,
  //       "created_by": "5ba724f3-e625-4b82-912c-5f7a080263c9",
  //       "created_at": "2025-11-25T08:32:00+00:00"
  //     }
  //   ]
  // }
  try {
    const { error } = await supabase.rpc(
      "create_plant_load_with_lines2",
      payload
    );
    if (error) throw error;
    return true;
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

const getProductForPurchase = async () => {
  try {
    const { data, error } = await supabase
      .from("materialized_products_cache")
      .select("*")
      .ilike("product_name", "% FULL");
    if (error) throw error;
    return data;
  } catch (error) {
    console.log((error as Error).message);

    throw error;
  }
};

const getPurchaseRegister = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("plant_load_register_view")
      .select("*")
      .eq("created_by", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  } catch (error) {
    console.log((error as Error).message);

    throw (error as Error).message;
  }
};



export {
  addPurchaseRegister,
  getProductForPurchase,
  getMaterializedProduct,
  getPurchaseRegister,
};
