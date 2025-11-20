import supabaseAdmin from "@/lib/supabase/supabaseAdmin";
import { Vehicle } from "@/types/types";

const add_vehicle = async (newVehicle: Vehicle) => {
  try {
    const { error } = await supabaseAdmin.from("vehicles").insert(newVehicle);
    if (error) throw error;
    return true;
  } catch (error) {
    console.log((error as Error).message);
    throw error;
  }
};

const display_vehicle = async () => {
  try {
    const { data, error } = await supabaseAdmin.from("vehicles").select("*");
    if (error) throw error;
    return data;
  } catch (error) {
    throw (error as Error).message;
  }
};

const delete_vehicle = async (id:string) => {
  try {
    const {error} = await supabaseAdmin.from("vehicles").delete().eq('id',id)
    if(error) throw error
    return true
  } catch (error) {
    throw (error as Error).message
  }
}

export { add_vehicle, display_vehicle, delete_vehicle };
