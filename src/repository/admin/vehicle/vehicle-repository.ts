import supabaseAdmin from "@/lib/supabase/supabaseAdmin";
import { Vehicle } from "@/types/types";

const add_vehicle = async (vehicle: Vehicle) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("vehicles")
      .insert(vehicle);
    if (error) throw error;
    return data;
  } catch (error) {
    console.log((error as Error).message);

    throw error;
  }
};

export { add_vehicle };
