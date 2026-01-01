import { TripFormData } from "@/app/(UI)/user/stock/_UI/trip-sheet";
import { StockTransferFormData } from "@/app/(UI)/user/stock/transfer/_UI/stock-transfer-section";
import {
  getpurchasedLoad,
  stock_Transfer,
  unload_Slip,
} from "@/repository/user/stock/stockRepository";
import { checkUserByAuthId } from "@/repository/user/userRepository";
import { STATUS } from "@/types/types";

const unloadSlipRegister = async (data: TripFormData, userId: string) => {
  try {
    const planLoadRegister_id = data?.plant_load_register_id as string;
    const existUser = await checkUserByAuthId(userId);
    if (existUser) {
      const payloadForUnloadSlip = {
        payload: data.tripLoadRecords.map((unloadItem) => ({
          product_id: unloadItem.product_id,
          qty: unloadItem.fullQuantity,
          return_product_id: unloadItem.return_product_id,
          return_qty: unloadItem.emptyQuantity,
          from_warehouse_id: data.warehouse_id,
          to_warehouse_id: unloadItem.to_warehouse_id,
          from_warehouse_return_id: unloadItem.to_warehouse_id,
          to_warehouse_return_id: unloadItem.return_warehouse_id,
          created_by: existUser.id,
          plant_load_register_id: planLoadRegister_id,
          plant_load_line_item_id: unloadItem.plant_load_line_item_id,
          trip_type: unloadItem.trip_type,
        })),
        payload_parent: {
          [planLoadRegister_id]: {
            unloading_date: data.date,
            unloading_staff: data.helpers,
          },
        },
      };
      const result = await unload_Slip(payloadForUnloadSlip);
      if (result) return { success: true };
      else throw new Error("Internal error");
    } else throw new Error("Un-authorized");
  } catch (error) {
    throw (error as Error).message;
  }
};

const transferStock = async (data: StockTransferFormData, userId: string) => {
  try {
    const existUser = await checkUserByAuthId(userId);
    if (existUser.id) {
      const payloadData = {
        payload: {
          date: data.date,
          "product id": data.product,
          qty: data.quantity,
          "from warehouse": data.from,
          "to warehouse": data.to,
          Empty_inclusive: data.withEmpty,
          "return product id": data.return_product_id,
          "return qty": data.quantity,
          "return from warehouse": data.to,
          "return to warehouse": data.from,
          remarks: data.remarks,
          "created by": existUser.id,
        },
      };
      const result = await stock_Transfer(payloadData);
      if (result) return { success: true };
      else return { success: false };
    } else throw new Error(STATUS.FORBIDDEN.message);
  } catch (error) {
    throw error;
  }
};

const getunloadData = async (id:string) =>{
  try {
    const result = await getpurchasedLoad(id)
    if(result) return { success:true , result}
    else return {success:false}
  } catch (error) {
    throw error
  }
}
export { unloadSlipRegister, transferStock, getunloadData };
