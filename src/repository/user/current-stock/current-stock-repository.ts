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

// export const running_balance_by_warehouse = async (
//   filters: RunningBalanceFilters = {}
// ) => {
//   console.log(filters);
  
//   try {
//     const lastNDays = filters.lastNDays ?? 0;
    
//     let query = supabase
//       .from('inventory_running_balance_view')
//       .select('*');

//     if (filters.startDate && filters.endDate) {
//   const start = new Date(filters.startDate);
//   const end = new Date(filters.endDate);

//   // Start of day
//   start.setHours(0, 0, 0, 0);

//   // Move end to next day (exclusive)
//   end.setDate(end.getDate() + 1);
//   end.setHours(0, 0, 0, 0);

//   query = query
//     .gte('transaction_date', start.toISOString())
//     .lt('transaction_date', end.toISOString());
// }
//  else if (filters.startDate) {
//       query = query.gte('transaction_date', filters.startDate);
//     } else if (filters.endDate) {
//       query = query.lte('transaction_date', filters.endDate);
//     } else {
//       // Default: last N days (including today)
//       const today = new Date();
//       const startDate = new Date(today);
//       startDate.setDate(today.getDate() - (lastNDays - 1));
      
//       // Format as YYYY-MM-DD
//       const startDateStr = startDate.toISOString().split('T')[0];
//       const todayStr = today.toISOString().split('T')[0];
      
//       query = query
//         .gte('transaction_date', startDateStr)
//         .lte('transaction_date', todayStr);
//     }

//     // Warehouse filter
//     if (filters.warehouseId) {
//       query = query.eq('warehouse_id', filters.warehouseId);
//     }

//     // Product filter
//     if (filters.productId) {
//       query = query.eq('product_id', filters.productId);
//     }

//     // Order by date descending
//     query = query.order('transaction_date', { ascending: false });

//     const { data, error } = await query;
//     console.log(data?.length);
    
//     if (error) throw error;
//     return data;
//   } catch (error) {
//     throw error;
//   }
// };
// export const running_balance_by_warehouse = async(filters: RunningBalanceFilters = {})=>{
//   try {
//     const {data,error} = await supabase.from('inventory_running_balance_view')
//     .select('*')
    
//     if(error) throw error
//     return data
//   } catch (error) {
//     throw error
//   }
// }

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
