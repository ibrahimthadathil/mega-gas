import { Expense } from "@/types/types";
import axios from "axios";
import { toast } from "sonner";

export const add_expense = async (data: Expense) => {
  try {
    const result = await axios.post("/api/user/expense", data);
    return result.data
  } catch (error) {
    toast.error("error from add expense");
  }
};
