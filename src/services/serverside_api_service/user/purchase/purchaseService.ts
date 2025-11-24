import { getAll_products } from "@/repository/admin/product/product-repository";
import { gettAllWareHouses } from "@/repository/user/warehouse/wareHouse_repository";

const addPurchase_Register = async () => {
  try {
  } catch (error) {
    throw (error as Error).message;
  }
};

const getPlantLoadCredential = async () => {
  try {
    const warehouse = await gettAllWareHouses();
    const products = await getAll_products();
  } catch (error) {
    throw (error as Error).message;
  }
};

export { addPurchase_Register, getPlantLoadCredential };
