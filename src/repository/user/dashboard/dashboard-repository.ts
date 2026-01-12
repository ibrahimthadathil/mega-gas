import supabase from "@/lib/supabase/supabaseClient";

type InventoryFilters = {
  warehouseIds?: string[]; // UUIDs
  warehouseNames?: string[]; // Names like "Godown"
  date?: string; // YYYY-MM-DD
};
const getInventoryTransactions = async (filters?: InventoryFilters) => {
  let query = supabase
    .from("inventory_transactions_view")
    .select("*")
    .order("transaction_date", { ascending: false });

  /* ---------------- warehouse id filter ---------------- */
  if (filters?.warehouseIds?.length) {
    query = query.contains("warehouses_info", filters.warehouseIds);
  }

  /* ---------------- warehouse name filter ---------------- */
  if (filters?.warehouseNames?.length) {
    query = query.contains("warehouses_info", filters.warehouseNames);
  }

  /* ---------------- date filter ---------------- */
  if (filters?.date) {
    query = query
      .gte("transaction_date", `${filters.date} 00:00:00`)
      .lte("transaction_date", `${filters.date} 23:59:59`);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
};

export { getInventoryTransactions };
