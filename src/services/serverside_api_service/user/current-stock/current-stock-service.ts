import { show_the_product_qty_by_product } from "@/repository/user/current-stock/current-stock-repository";

const getQtyByProductAndWarehouse = async (data: {
  warehouseId: string;
  products: string[];
}) => {
  try {
    const stockQty = await show_the_product_qty_by_product(
      data.warehouseId,
      data.products,
    );
    if (stockQty) return { success: true, stockQty };
    else throw new Error("Failed to get");
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export { getQtyByProductAndWarehouse };
