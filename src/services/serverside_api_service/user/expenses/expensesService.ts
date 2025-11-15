import { add_Expense } from "@/repository/user/expenses/expenseRepository";
import { checkUserByAuthId } from "@/repository/user/userRepository";
import { Expense } from "@/types/types";

const addExpenses = async (expenseData: Expense) => {
  try {    
    const checkUser = await checkUserByAuthId(expenseData?.created_by as string);
    expenseData.created_by = checkUser.id
    const {data,success} = await add_Expense(expenseData); 
    if (success) return success;
    else success
  } catch (error) {
     throw new Error((error as Error).message)
  }
};

export { addExpenses };
