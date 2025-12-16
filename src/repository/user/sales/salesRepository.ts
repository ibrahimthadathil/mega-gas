import supabase from "@/lib/supabase/supabaseClient";

const getDeliveryPayloadByVehicle = async (vehicleId: string) => {
  try {
    const { data, error } = await supabase
      .from("current_inventory_levels")
      .select("*")
      .eq("warehouse_id", vehicleId)
      .eq("is_empty", false);
    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};

const getAllProductsOptions = async ()=>{
  try {
    const {data,error} = await supabase.from('products').select('*').eq('is_empty',false).eq('visibility',true)
    if(error) throw error
    return data
  } catch (error) {
    throw error
  }
}

export { getDeliveryPayloadByVehicle, getAllProductsOptions };
