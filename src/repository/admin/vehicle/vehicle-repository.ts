import supabaseAdmin from "@/lib/supabase/supabaseAdmin";
import { Vehicle } from "@/types/types";

const add_vehicle = async (newVehicle: Vehicle) => {
  try {    
    const { error } = await supabaseAdmin
      .from("vehicles")
      .insert(newVehicle);
    if (error) throw error;
    return true;
  } catch (error) {
    console.log('ll');
    
    console.log((error as Error).message);
    throw error;
  }
};

export { add_vehicle };
