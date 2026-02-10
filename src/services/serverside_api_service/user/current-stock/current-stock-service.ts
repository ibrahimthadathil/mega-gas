import { getCurrentInventory, show_the_product_qty_by_product } from "@/repository/user/current-stock/current-stock-repository";
import { STATUS } from "@/types/types";

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

const getInventoryStatus = async()=>{
    try {
        const details = await getCurrentInventory()
        if(details)return { success:true , data:details }
        else throw Error (STATUS.NOT_FOUND.message)
    } catch (error) {
        return{success:false,message:(error as Error).message}
    }
}

export { getQtyByProductAndWarehouse, getInventoryStatus };
