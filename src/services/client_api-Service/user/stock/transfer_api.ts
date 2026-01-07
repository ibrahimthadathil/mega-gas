import axios from "axios";

// to view all the transferd stock
export const getTransferedStockSTatus = async () => {
  try {
    const result = await axios.get("/api/user/stock/transfer");
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
