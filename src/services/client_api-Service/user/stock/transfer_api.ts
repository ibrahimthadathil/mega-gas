import axios from "axios";

// to view all the transferd stock
export const getTransferedStockSTatus = async (filter: {
  page: number;
  limit: number;
  startDate?: string;
  endDate?: string;
  warehouseId?: string;
}) => {
  try {
    const result = await axios.get("/api/user/stock/transfer", {
      params: {
        page: filter?.page || 1,
        limit: filter?.limit || 10,
        startDate: filter?.startDate,
        endDate: filter?.endDate,
        warehouseId:
          filter?.warehouseId !== "all" ? filter?.warehouseId : undefined,
      },
    });
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTransferedStockRecord = async (id: string) => {
  try {
    const result = await axios.delete(`/api/user/stock/transfer/${id}`);
    return result.data;
  } catch (error) {
    throw error;
  }
};
export const EditTransferedStockRecord = async (id: string, data: any) => {
  try {
    const result = await axios.put(`/api/user/stock/transfer/${id}`, data);
    return result.data;
  } catch (error) {
    throw error;
  }
};
