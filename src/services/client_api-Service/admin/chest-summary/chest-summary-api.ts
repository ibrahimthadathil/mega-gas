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
