import { TripFormData } from "@/app/(UI)/user/stock/_UI/trip-sheet";
import { StockTransferFormData } from "@/lib/schema/stock";
import {
  delete_stock_transfer,
  Edit_stock_transfer,
  getAlltransferedStock,
  getpurchasedLoad,
  stock_Transfer,
  unload_Slip,
  view_Transfered_stock,
} from "@/repository/user/stock/stockRepository";
import { checkUserByAuthId } from "@/repository/user/userRepository";
import { TransferStockFilters } from "@/types/stock";
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
          "return product id": data.withEmpty ? data.return_product_id : null,
          "return qty": data.withEmpty ? data.quantity : 0,
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

const getunloadData = async (id: string) => {
  try {
    const result = await getpurchasedLoad(id);
    if (result) return { success: true, result };
    else return { success: false };
  } catch (error) {
    throw error;
  }
};

// this function currently not using
const getTransferedView = async (id: string) => {
  try {
    const existUser = await checkUserByAuthId(id);
    if (existUser) {
      const result = await getAlltransferedStock(existUser.id);
      if (result) return { result, success: true };
      else return { result: [], success: true };
    } else throw new Error(STATUS.UNAUTHORIZED.message);
  } catch (error) {
    throw error;
  }
};

const displayStockTransfer = async (filter: TransferStockFilters) => {
  try {
    const { count, data } = await view_Transfered_stock(filter);
    if (data) return { success: true, data, count };
    else return { success: true, data: [] };
  } catch (error) {
    throw error;
  }
};

const deleteTransferStock = async (transferId: string) => {
  try {
    const deleted = await delete_stock_transfer(transferId);
    if (deleted) return { success: true, message: "Deleted" };
    else return { success: false, message: "Failed to Delete" };
  } catch (error) {
    throw error;
  }
};

const EditStockTranfer = async (
  authId: string,
  transferId: string,
  data: StockTransferFormData,
) => {
  try {
    const checkUser = await checkUserByAuthId(authId);
    const payload = {
      date: data.date,
      "product id": data.product,
      qty: data.quantity,
      "from warehouse": data.from,
      "to warehouse": data.to,
      Empty_inclusive: data.withEmpty,
      "return product id": data.withEmpty ? data.return_product_id : null,
      "return qty": data.withEmpty ? data.quantity : 0,
      "return from warehouse": data.to,
      "return to warehouse": data.from,
      remarks: data.remarks,
      "created by": checkUser.id,
    };

    if (checkUser) {
      const Edited = await Edit_stock_transfer(transferId, payload);
      if (Edited) return { success: true, message: "Transfer Edited" };
      else return { success: false, message: "Failed to edit" };
    } else throw Error(STATUS.UNAUTHORIZED.message);
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

const getTransferById = async () => {
  try {
  } catch (error) {}
};
export {
  unloadSlipRegister,
  transferStock,
  getTransferById,
  getunloadData,
  getTransferedView,
  displayStockTransfer,
  deleteTransferStock,
  EditStockTranfer,
};
