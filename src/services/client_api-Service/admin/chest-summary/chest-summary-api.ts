import { CashAdjustmentForm } from "@/components/accounts/denominatio";
import axios from "axios";

export const getAllChestSummary = async (filter: {
  status?: string;
  chest?: string;
}) => {
  try {
    const result = await axios.get("/api/admin/chest-summary", {
      params: {
        status: filter.status,
        chest: filter.chest,
      },
    });
    return result.data
  } catch (error) {
    throw error;
  }
};

export const makeAdjustment = async (data:CashAdjustmentForm)=>{
    try {
        const result = await axios.post('/api/admin/chest-summary',data)
        return result.data
    } catch (error) {
        throw error
    }
}
