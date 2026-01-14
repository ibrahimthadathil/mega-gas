import { InventoryFilters } from "@/types/inventory";
import { inventoryRepository } from "@/repository/user/dashboard/dashboard-repository";
import { get_All_cylinders } from "@/repository/admin/product/product-repository";

export const getDasboardData = async (filters: InventoryFilters) => {
  const DEFAULT_PRODUCT = "14 FULL";
  const DEFAULT_LIMIT = 10;

  try {
    const normalizedFilters: InventoryFilters = {
      ...filters,
      productNames: filters.productNames?.length
        ? filters.productNames
        : [DEFAULT_PRODUCT],
      page: filters.page ?? 1,
      limit: filters.limit ?? DEFAULT_LIMIT,
    };

    const { count, data } = await inventoryRepository.getInventoryTransactions(
      normalizedFilters
    );
    const products = await get_All_cylinders();
    if (data) {
      return {
        success: true,
        data,
        products,
        count,
      };
    } else return { success: false, message: "somthing wrong try later" };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};
