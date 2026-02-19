import supabase from "@/lib/supabase/supabaseClient";
import { RunningBalanceFilters } from "@/types/stock";

const show_the_product_qty_by_product = async (
  warehouseid: string,
  products: string[],
) => {
  try {
    const { data, error } = await supabase
      .from("current_inventory_levels")
      .select("product_name, qty")
      .eq("warehouse_id", warehouseid)
      .in("product_id", products);
    if (error) throw error;
    return data;
  } catch (error) {
    console.log((error as Error).message);
    throw error;
  }
};
const getCurrentInventory = async () => {
  try {
    const { data, error } = await supabase
      .from("current_inventory_levels")
      .select("*");
    if (error) throw error;
    return data;
  } catch (error) {
    console.log((error as Error).message);
    throw error;
  }
};

// running balance 

export const running_balance_by_warehouse = async (filters: RunningBalanceFilters = {}) => {
  try {
    let query = supabase.from('inventory_running_balance_view').select('*');

    if (filters.startDate) {
      query = query.gte('transaction_date', filters.startDate);
    }
    if (filters.endDate) {
      query = query.lte('transaction_date', filters.endDate);
    }
    if (filters.warehouseId) {
      query = query.eq('warehouse_id', filters.warehouseId);
    }
    if (filters.productId) {
      query = query.eq('product_id', filters.productId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};
export {show_the_product_qty_by_product,getCurrentInventory}
