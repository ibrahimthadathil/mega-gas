import {
  add_product,
  edit_Product,
  getAll_products,
  getEdit_Product,
} from "@/repository/admin/product/product-repository";
import { checkUserByAuthId } from "@/repository/user/userRepository";
import { IProduct } from "@/types/types";

const addNewProduct = async (payloads: IProduct, userId: string) => {
  try {
    const checkUser = await await checkUserByAuthId(userId);
    if (checkUser) {
      const payload = {
        p_product: {
          ...payloads,
          created_by: checkUser.id,
        },
        p_components: payloads.is_composite
          ? payloads.composition.map((c) => ({
              child_product_id: c.childProductId,
              qty: c.qty,
            }))
          : [],
      };

      const result = await add_product(payload);
      if (result) return { success: true };
      else return { success: false };
    } else throw new Error("un-authorized");
  } catch (error) {
    throw (error as Error).message;
  }
};

const getAllProducts = async () => {
  try {
    const data = await getAll_products();
    if (data) return { success: true, data };
    else return { success: false };
  } catch (error) {
    throw (error as Error).message;
  }
};

const getEditProduct = async (id: string, authId: string) => {
  try {
    const checkUser = await await checkUserByAuthId(authId);
    if (checkUser) {
      const result = await getEdit_Product(id);
      if (result) return { success: true, data: result };
      else return { success: false };
    } else throw new Error("un-authorized");
  } catch (error) {
    throw (error as Error).message;
  }
};

const editProduct = async (id: string, authId: string, data: IProduct) => {
  try {    
    const checkUser = await await checkUserByAuthId(authId);
    if (checkUser) {
      const payload = {
        p_product_id: id,
        p_product: {
          product_code: data.product_code,
          product_name: data.product_name,
          product_type: data.product_type,
          available_qty: data.available_qty,
          sale_price: data.sale_price,
          cost_price: data.cost_price,
          price_edit_enabled: data.price_edit_enabled,
          visibility: data.visibility,
          is_composite: data.is_composite,
          tags: data.tags ?? [],
          created_by: checkUser.id,
        },
        p_components: data.is_composite
          ? data.composition.map((c: any) => ({
              child_product_id: c.childProductId,
              qty: c.qty ?? 1,
            }))
          : [],
      };      
      const result = await edit_Product(payload);
      if (result) return { success: true };
      else return { success: false };
    } else throw new Error("un-authorized");
  } catch (error) {
    throw (error as Error).message;
  }
};

export { addNewProduct, getAllProducts, getEditProduct, editProduct };
