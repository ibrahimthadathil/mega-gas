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

// export const getPlantLoadRegister = async () => {
//   try {
//     const result = await axios.get("/api/user/purchase");
//     return result.data;
//   } catch (error) {
//     throw error;
//   }
// };
// services/client_api-Service/user/purchase/purchase_api.ts

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
    const params = new URLSearchParams();

    if (filters?.startDate) {
      params.append("startDate", filters.startDate);
    }
    if (filters?.endDate) {
      params.append("endDate", filters.endDate);
    }
    if (filters?.warehouse) {
      params.append("warehouse", filters.warehouse);
    }
    if (filters?.isUnloaded !== undefined && filters?.isUnloaded !== "") {
      params.append("isUnloaded", filters.isUnloaded);
    }
    if (filters?.page) {
      params.append("page", filters.page.toString());
    }
    if (filters?.limit) {
      params.append("limit", filters.limit.toString());
    }

    const queryString = params.toString();
    const url = `/api/user/purchase${queryString ? `?${queryString}` : ""}`;

    const result = await axios.get(url);
    
    return result
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
  data: Record<string, unknown>
) => {
  try {
    const result = await axios.put(`/api/user/purchase/${id}`, data);
    return result.data;
  } catch (error) {
    throw error;
  }
};
