import { add_product, getAll_products } from "@/repository/admin/product/product-repository";
import { checkUserByAuthId } from "@/repository/user/userRepository";
import { IProduct } from "@/types/types";

const addNewProduct = async (payloads: IProduct, userId: string) => {
  try {
    const checkUser = await await checkUserByAuthId(userId);
    if (checkUser) {
      const payload = {
        p_product: { ...payloads, created_by: checkUser.id },
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
    const data = await getAll_products()
    if(data) return {success:true,data}
    else return {success:false}
  } catch (error) {
    throw (error as Error).message;
  }
};

export { addNewProduct, getAllProducts };
