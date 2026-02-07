import { lineItemFilterProps } from "@/types/transaction ";
import axios from "axios";

export const getAllTransactions = async (
  filter?: lineItemFilterProps & { page?: number; limit?: number },
) => {
  try {
    const result = await axios.get("/api/user/accounts/transactions", {
      params: {
        account_name: filter?.account_name,
        date: filter?.date,
        source_form: filter?.source_form,
        type: filter?.type,
        page: filter?.page ?? 1,
        limit: filter?.limit ?? 10,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const deleteTransaction = async (id: string) => {
  try {
    const result = await axios.delete(`/api/user/accounts/transactions/${id}`);
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const updateTransaction = async (id: string, transaction: any) => {
  try {
    const result = await axios.put(
      `/api/user/accounts/transactions/${id}`,
      transaction,
    );
    return result.data;
  } catch (error) {
    throw error;
  }
};
