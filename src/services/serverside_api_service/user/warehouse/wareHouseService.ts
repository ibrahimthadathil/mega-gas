import { Warehouse } from "@/app/(UI)/user/warehouses/page";
import { checkUserByAuthId } from "@/repository/user/userRepository";
import { addNew_WareHouse, gettAllWareHouses } from "@/repository/user/warehouse/wareHouse_repository";

const AddNewWareHouse = async (data: Omit<Warehouse, "id">) => {
  try {
    const checkUser = await checkUserByAuthId(data?.created_by as string);
    if (checkUser) {
      data.created_by = checkUser.id;
      const success = await addNew_WareHouse(data);
      if (success) return success;
    } else throw new Error("Un-authorized");
  } catch (error) {
    throw (error as Error).message;
  }
};

const getWareHouses = async () => {
  try {
    const data = await gettAllWareHouses()
    if(data) return {success:true, data}
    else return {success:false}
  } catch (error) {
    throw (error as Error).message;
  }
};
export { AddNewWareHouse, getWareHouses };
