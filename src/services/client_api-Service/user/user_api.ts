import { Expense } from "@/types/types";
import axios from "axios";
import { toast } from "sonner";

export const add_expense = async (data: Expense) => {
  try {
    const result = await axios.post("/api/user/expense", data);
    return result.data;
  } catch (error) {
    toast.error("error from adding expense");
  }
};

export const get_expenses = async () => {
  try {
    const result = await axios.get('/api/user/expense')
      return result.data    
  } catch (error) {
    toast.error("error from showing expense");
  }
};
