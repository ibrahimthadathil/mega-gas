import { Warehouse } from "@/app/(UI)/user/warehouses/page";
import supabase from "@/lib/supabase/supabaseClient";

const addNew_WareHouse = async (newWarehouse: Omit<Warehouse, "id">) => {
  try {
    const { error } = await supabase
      .from("warehouses")
      .insert(newWarehouse);
    if (error) throw error;
    return true;
  } catch (error) {
    throw error;
  }
};

const gettAllWareHouses = async () => {
  try {
    const { data, error } = await supabase.from("warehouses").select("*");
    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};

export { addNew_WareHouse, gettAllWareHouses };
