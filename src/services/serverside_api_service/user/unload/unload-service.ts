import {
  delete_unload_slip,
  edit_unload_slip,
  get_All_Unload_Details,
} from "@/repository/user/unload/unloadRepository";
import { checkUserByAuthId } from "@/repository/user/userRepository";
import { UnloadFilters } from "@/types/unloadSlip";

const getAllUnloadDetails = async (filter:UnloadFilters) => {
  try {
    const {data,page,limit,total,totalPages} = await get_All_Unload_Details(filter);
    if (data) return { success: true, data,page,limit,total,totalPages };
    else return { success: false };
  } catch (error) {
    return { success: true, message: (error as Error).message };
  }
};

const deleteUnloadSlipById = async (id: string, authId: string) => {
  try {
    const checkUser = await checkUserByAuthId(authId);
    if (checkUser) {
      const isDeleted = await delete_unload_slip(id, checkUser.id);
      if (isDeleted) return { success: true, message: "deleted" };
      else return { success: false, message: "Failed to delete, Try later" };
    }
    throw new Error("Unauthorized");
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

const editUnloadSlip = async (data: any) => {
  try {
    const p_payload = data.tripLoadRecords.map((r: any) => ({
      product_id: r.product_id,
      qty: r.fullQuantity,
      return_product_id: r.return_product_id,
      return_qty: r.emptyQuantity,
      from_warehouse_id: data.warehouse_id,
      to_warehouse_id: r.to_warehouse_id,
      from_warehouse_return_id: r.to_warehouse_id,
      to_warehouse_return_id: r.return_warehouse_id,
      plant_load_register_id: data.plant_load_register_id,
      plant_load_line_item_id: r.plant_load_line_item_id,
      trip_type: r.trip_type,
      created_by: data.created_by,
    }));
    const p_payload_parent = {
      [data.plant_load_register_id]: {
        unloading_date: data.date,
        unloading_staff: data.helpers,
      },
    };
   const updated =  await edit_unload_slip({
      p_plant_load_register_id: data.plant_load_register_id,
      p_user_id: data.created_by,
      p_payload,
      p_payload_parent,
    });
    if(updated) return {success:true,message:"Updated"}
    else throw new Error("Failed to update")
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};
export { getAllUnloadDetails, deleteUnloadSlipById, editUnloadSlip };
