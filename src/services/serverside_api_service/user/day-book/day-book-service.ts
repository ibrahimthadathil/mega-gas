import {
  add_cash_adjustment,
  get_Day_Book,
} from "@/repository/user/day-book/day-book-repository";
import { checkUserByAuthId } from "@/repository/user/userRepository";
import { STATUS } from "@/types/types";

const getDayBookDetails = async (filter: any) => {
  try {
    const { data, success } = await get_Day_Book(filter);
    if (success) return { success, data };
    else return { success };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

const registerCashAdjust = async (authId:string,data:any) => {
  try {
    const user = await checkUserByAuthId(authId)
    if(!user)throw Error(STATUS.UNAUTHORIZED.message)
    const payload = {
      chest_name:"office",
      created_by:user.id,
      status:'Settled',
      source_reference_type:'Note adjustment',
      
  };
    const success = await add_cash_adjustment(payload);
    if (success) return {success};
    else throw Error("failed to change");
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export { registerCashAdjust, getDayBookDetails };
