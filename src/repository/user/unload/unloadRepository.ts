import supabase from "@/lib/supabase/supabaseClient";

const get_All_Unload_Details = async () => {
  try {
    const { data, error } = await supabase
      .from("plant_load_unload_view")
      .select("*")
      .order("unload_date", { ascending: true, nullsFirst: true })
      .order("bill_date", { ascending: true }); // change this after 

    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};

const edit_unload_slip = async (payload: {
  p_plant_load_register_id: string;
  p_payload: any;
  p_payload_parent: any | null;
  p_user_id: string;
}) => {
  try {
    const { error } = await supabase.rpc("edit_unload_slip", payload);
    if (error) throw error;
    return true;
  } catch (error) {
    console.log((error as Error).message);
    throw error;
  }
};

const delete_unload_slip = async (plantId: string, userId: string) => {
  try {
    const { error } = await supabase.rpc("reverse_plant_unloading", {
      p_plant_load_register_id: plantId,
      p_user_id: userId,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.log((error as Error).message);
    throw error;
  }
};

export { get_All_Unload_Details, edit_unload_slip, delete_unload_slip };
