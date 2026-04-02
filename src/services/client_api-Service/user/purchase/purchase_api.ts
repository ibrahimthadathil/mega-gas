import axios from "axios";

export const getPurchaseCredentials = async () => {
  try {
    const result = await axios.get("/api/user/purchase/credential");
    return result.data;
  } catch (error) {
    throw (error as Error).message;
  }
};

export const addPurchaseRegister = async (data: Record<string, unknown>) => {
  try {
    const result = await axios.post("/api/user/purchase", data);
    return result.data;
  } catch (error) {
    throw (error as Error).message;
  }
};

export const purchaseReport = async (filter?: {
  warehouse?: string;
  date?: string; // single day (legacy, mapped to from/to for backwards compatibility)
  from?: string; // "YYYY-MM-DD"
  to?: string; // "YYYY-MM-DD"
  month?: number; // 1-12
  year?: number;
}) => {
  try {
    // Handle legacy date parameter: map single date to from/to range
    let from = filter?.from;
    let to = filter?.to;
    
    if (filter?.date && !from && !to) {
      from = filter.date;
      to = filter.date;
    }
    
    // Filter precedence: month/year > from/to > date (legacy)
    const result = await axios.get("/api/user/purchase/report", {
      params: {
        warehouse: filter?.warehouse ?? "ALL",
        from,
        to,
        month: filter?.month,
        year: filter?.year,
      },
    });
    return result.data;
  } catch (error) {
    throw error;
  }
};

interface FilterParams {
  startDate?: string;
  endDate?: string;
  warehouse?: string;
  isUnloaded?: string;
  page?: number;
  limit?: number;
}

export const getPlantLoadRegister = async (filters?: FilterParams) => {
  try {
    const result = await axios.get("/api/user/purchase", {
      params: {
        startDate: filters?.startDate,
        endDate: filters?.endDate,
        page: filters?.page,
        limit: filters?.limit,
        isUnloaded: filters?.isUnloaded,
        warehouse: filters?.warehouse,
      },
    });

    return result;
  } catch (error) {
    throw error;
  }
};

export const deletePurchasedRecord = async (id: string) => {
  try {
    const result = await axios.delete(`/api/user/purchase/${id}`);
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const editPurchase = async (
  id: string,
  data: Record<string, unknown>,
) => {
  try {
    const result = await axios.put(`/api/user/purchase/${id}`, data);
    return result.data;
  } catch (error) {
    throw error;
  }
};
