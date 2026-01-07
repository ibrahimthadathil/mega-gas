import {
  addPurchaseRegister,
  delete_purchase,
  getProductForPurchase,
  getPurchaseRegister,
} from "@/repository/user/purchase/purchaseRepository";
import { checkUserByAuthId } from "@/repository/user/userRepository";
import { gettAllWareHouses } from "@/repository/user/warehouse/wareHouse_repository";
import { PurchaseRegisterPayload } from "@/types/types";

const addPurchase_Register = async (
  data: PurchaseRegisterPayload,
  userId: string
) => {
  try {
    const existUser = await checkUserByAuthId(userId);
    if (existUser) {
      const totalQuantity = data.products.reduce(
        (acc, val) => acc + val.quantity,
        0
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

const getPlantLoadRegister = async (authId: string) => {
  try {
    const existUser = await checkUserByAuthId(authId);
    if (existUser) {
      const data = await getPurchaseRegister(existUser.id);
      return { success: true, data };
    } else throw new Error("un-authorized");
  } catch (error) {
    throw (error as Error).message;
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
export {
  addPurchase_Register,
  getPlantLoadCredential,
  getPlantLoadRegister,
  deletePurchaseRecord,
};
