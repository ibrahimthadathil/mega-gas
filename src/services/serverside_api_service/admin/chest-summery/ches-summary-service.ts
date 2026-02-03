import { get_ALL_chest_SUmmery } from "@/repository/admin/chest-summeary/chest-summary-repository";

const getAllChestSummary = async (filter?: {
  chest?: "office" | "godown";
  status?: "settled" | "submitted";
}) => {
  try {
    const data = await get_ALL_chest_SUmmery(filter);
    if (data) return { success: true, data };
    else throw Error('failed to fetch')
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export { getAllChestSummary };
