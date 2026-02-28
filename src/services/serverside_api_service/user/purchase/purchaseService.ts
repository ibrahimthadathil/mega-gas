import {
  addPurchaseRegister,
  delete_purchase,
  edit_Purchased_Load,
  getProductForPurchase,
  getPurchaseRegister,
} from "@/repository/user/purchase/purchaseRepository";
import { checkUserByAuthId } from "@/repository/user/userRepository";
import { gettAllWareHouses } from "@/repository/user/warehouse/wareHouse_repository";
import { PurchaseRegisterPayload } from "@/types/types";

const addPurchase_Register = async (
  data: PurchaseRegisterPayload,
  userId: string,
) => {
  try {
    const existUser = await checkUserByAuthId(userId);
    if (existUser) {
      const totalQuantity = data.products.reduce(
        (acc, val) => acc + val.quantity,
        0,
      );
      const p_line_items = data.products.map((product) => ({
        product_id: product.id,
        full_qty: product.quantity,
        trip_type: product.tripType,
        return_qty: product.quantity,
        warehouse_id: data.warehouse,
        composite: product.is_composite,
        return_product_id: product.return_product_id,
        created_by: existUser.id,
        product_component: product.is_composite
          ? product.components?.map((child) => ({
              child_product_id: child.child_product_id,
              qty: child.qty,
            })) || []
          : [],
      }));
      const payload = {
        p_register: {
          sap_number: data.sapNumber,
          bill_date: data.date,
          total_qty: totalQuantity,
          tax_invoice_number: data.invoiceNumber,
          warehouse_id: data.warehouse,
          created_by: existUser.id,
        },
        p_line_items,
      };

      const success = await addPurchaseRegister(payload);
      if (success) return { success: true };
      else return { success: false };
    } else throw new Error("Un-authorized");
  } catch (error) {
    throw (error as Error).message;
  }
};

const getPlantLoadCredential = async () => {
  try {
    const warehouse = await gettAllWareHouses();
    const products = await getProductForPurchase();

    if (warehouse && products) return { success: true, warehouse, products };
    else return { success: false };
  } catch (error) {
    throw (error as Error).message;
  }
};

const getPlantLoadRegister = async (authId: string, {...rest}: any) => {
  try {
    const existUser = await checkUserByAuthId(authId);
    if (existUser) {
      const { data, message, success, total, totalPages } =
        await getPurchaseRegister(existUser.id, existUser.role, rest);
        
      if (success) return { success, data, total, totalPages, message };
      else throw new Error(message);
    } else throw new Error("un-authorized");
  } catch (error) {
    return { message: (error as Error).message, success: false };
  }
};

const deletePurchaseRecord = async (id: string) => {
  try {
    const isDeleted = await delete_purchase(id);
    if (isDeleted) return { success: true, message: "Deleted" };
    else return { success: false, message: "Failed to delete" };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

const editPurchasedLoad = async (
  id: string,
  userId: string,
  data: PurchaseRegisterPayload,
) => {
  try {
    const existUser = await checkUserByAuthId(userId);
    if (existUser) {
      const registerPayload = {
        sap_number: data.sapNumber,
        bill_date: data.date,
        warehouse_id: data.warehouse,
        tax_invoice_number: data.invoiceNumber,
        created_by: existUser.id,
      };
      const lineItemPayload = data.products.map((product) => ({
        product_id: product.id,
        full_qty: product.quantity,
        trip_type: product.tripType,
        return_qty: product.quantity,
        warehouse_id: data.warehouse,
        composite: product.is_composite,
        return_product_id: product.return_product_id,
        created_by: existUser.id,
        product_component: product.is_composite
          ? product.components?.map((child) => ({
              child_product_id: child.child_product_id,
              qty: child.qty,
            })) || []
          : [],
      }));

      const isEdited = await edit_Purchased_Load(
        id,
        registerPayload,
        lineItemPayload,
      );
      if (isEdited) return { success: true, message: "Purchase Updated" };
      else return { success: false, message: "Updation Failed" };
    } else throw Error("Un-authorized");
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

const purchaseReport = async()=>{
  try {
    
  } catch (error) {
    return {success:false, message:(error as Error).message}
  }
}

export {
  addPurchase_Register,
  getPlantLoadCredential,
  getPlantLoadRegister,
  deletePurchaseRecord,
  editPurchasedLoad,
  purchaseReport
};
