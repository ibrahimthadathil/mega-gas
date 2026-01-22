import axios from "axios";

export const getDashboardData = async (filters?: any) => {
  try {    
    const  data  = await axios.get("/api/user/dashboard", {
      params: {
        warehouseNames: filters?.warehouseNames?.join(","),
        productNames: filters?.productNames?.join(","),
        startDate: filters?.startDate,
        endDate: filters?.endDate,
        page: filters?.page,
        limit: filters?.limit,
      },
    });

    return data;
  } catch (error) {
    throw error;
  }
};
