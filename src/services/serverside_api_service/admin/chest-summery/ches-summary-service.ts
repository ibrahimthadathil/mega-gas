import {
  add_cash_adjustment,
  get_ALL_chest_SUmmery,
} from "@/repository/admin/chest-summeary/chest-summary-repository";
import { checkUserByAuthId } from "@/repository/user/userRepository";
import { STATUS } from "@/types/types";

const getAllChestSummary = async (filter?: {
  chest?: "office" | "godown";
  status?: "settled" | "submitted";
}) => {
  try {
    const data = await get_ALL_chest_SUmmery(filter);
    if (data) return { success: true, data };
    else throw Error("failed to fetch");
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

const registerCashAdjust = async (authId: string, data: any) => {
  try {
    const user = await checkUserByAuthId(authId);
    if (!user) throw Error(STATUS.UNAUTHORIZED.message);
    const payload = {
      chest_name: "office",
      created_by: user.id,
      status: "Settled",
      source_reference_type: "Note adjustment",
      ...data
    };    
    const success = await add_cash_adjustment(payload);
    if (success) return { success };
    else throw Error("failed to change");
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export { getAllChestSummary, registerCashAdjust };
