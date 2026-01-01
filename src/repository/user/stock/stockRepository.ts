import supabase from "@/lib/supabase/supabaseClient";

const unload_Slip = async (payload: Record<string, unknown>) => {
  try {
    const { error } = await supabase.rpc("unload_slip_insert", payload);
    if (error) throw error;
    return true;
  } catch (error) {
    console.log((error as Error).message);
    throw (error as Error).message;
  }
};

const stock_Transfer = async (data: Record<string, unknown>) => {
  try {
    // const payload = {
    //   payload: {
    //     date: "2025-12-01",
    //     "product id": "5ad42421-df1d-4902-91d1-ae7af7123c15",
    //     // "product id": "18b9c107-3ee2-486f-bdb0-df895b5a40ee",
    //     qty: 25,
    //     // "from warehouse": "4557aa99-60d9-452b-bb7d-3d1d487dbe33", // chelari
    //     "from warehouse": "5ea32457-d1d2-4c10-a90c-f0fc4de70ffb", // s sathyan
    //     "to warehouse": "99a57515-d36a-42ec-8d63-8a72d2b95ab2", // saleem
    //     Empty_inclusive: true,
    //     "return product id": "18b9c107-3ee2-486f-bdb0-df895b5a40ee",
    //     "return qty": 25,
    //     "return from warehouse": "99a57515-d36a-42ec-8d63-8a72d2b95ab2", //saleem
    //     "return to warehouse": "5ea32457-d1d2-4c10-a90c-f0fc4de70ffb", //sathyan
    //     // "return to warehouse": "4557aa99-60d9-452b-bb7d-3d1d487dbe33",
    //     remarks: "Trial run",
    //     "created by": "5ba724f3-e625-4b82-912c-5f7a080263c9",
    //     "created at": "2025-12-01T11:30:00Z",
    //   },
    // };
    const { error } = await supabase.rpc("create_stock_transfer", data);
    if (error) throw error;
    return true;
  } catch (error) {
    console.log((error as Error).message);
    throw error;
  }
};

const getpurchasedLoad = async (id: string) => {
  try {
    const { data, error} = await supabase
      .from("plant_load_register_view")
      .select("*")
      .eq("id", id);
      if(error) throw error
      return data
  } catch (error) {
    console.log((error as Error).message);
    throw error
  }
};

export { unload_Slip, stock_Transfer, getpurchasedLoad };
