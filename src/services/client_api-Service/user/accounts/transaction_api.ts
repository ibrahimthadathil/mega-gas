import axios from "axios";

export const getAllTransactions = async () => {
  try {
    const result = await axios.get("/api/user/accounts/transactions");
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTransaction = async (id: string) => {
  try {
    alert(id)
    const result = await axios.delete(`/api/user/accounts/transactions/${id}`);
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const updateTransaction = async (id: string, transaction: any) => {
  try {
    const result = await axios.put(`/api/user/accounts/transactions/${id}`, transaction);
    return result.data;
  } catch (error) {
    throw error;
  }
};