import { getInventoryTransactions } from "@/repository/user/dashboard/dashboard-repository";
import { STATUS } from "@/types/types";

const getDasboardData = async () => {
  try {
    const data = await getInventoryTransactions();
    if (data) return { success: true, data };
    else return { success: false, message: STATUS.NO_CONTENT.code };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export {getDasboardData}
