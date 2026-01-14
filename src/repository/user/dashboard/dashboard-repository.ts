import supabase from "@/lib/supabase/supabaseClient";
import { InventoryFilters } from "@/types/inventory";

const inventoryRepository = {
  async getInventoryTransactions(filters: InventoryFilters) {
    let query = supabase
      .from("inventory_transactions_view")
      .select("*", { count: "exact" })
      .order("transaction_date", { ascending: false });

     query = query.in("product_name", filters.productNames!);

    if (filters.warehouseNames?.length) {
      const names = filters.warehouseNames.join(",");
      query = query.or(
        `from_warehouse_name.in.(${names}),to_warehouse_name.in.(${names})`
      );
    }

    // Date range
    if (filters.startDate) {
      query = query.gte(
        "transaction_date",
        new Date(filters.startDate).toISOString()
      );
    }

    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      query = query.lte("transaction_date", end.toISOString());
    }

    // Pagination
    const from = (filters.page! - 1) * filters.limit!;
    const to = from + filters.limit! - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;
    if (error) throw error;

    return { data, count };
  },
};

export { inventoryRepository };
