import {
  add_Expense,
  delete_Expense,
  edit_Expense,
  getAllExpenses,
} from "@/repository/user/expenses/expenseRepository";
import { checkUserByAuthId } from "@/repository/user/userRepository";
import { Expense } from "@/types/types";

const addExpenses = async (expenseData: Expense) => {
  try {
    const checkUser = await checkUserByAuthId(
      expenseData?.created_by as string
    );
    expenseData.created_by = checkUser.id;
    const { success } = await add_Expense(expenseData);
    if (success) return success;
    else return success;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

const getExpensesByUser = async (userId: string) => {
  try {
    const checkUser = await checkUserByAuthId(userId);
    const { data, success } = await getAllExpenses(checkUser.id);
    if (success) return { data, success };
    else return { success };
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

const clear_Expense = async (expenseId: string) => {
  try {
    const deleted = await delete_Expense(expenseId);
    if (deleted) return true;
    else throw new Error("Failed to delete");
  } catch (error) {
    console.log((error as Error).message,'ererer');
    
    throw new Error((error as Error).message);
  }
};

const updateExpense = async(id:string,expense:Partial<Expense>)=>{
  try {
    const updated = await edit_Expense(id,expense)
    if(updated)return {success:true,message:'updated'}
    else return {success:false,message:'failed to update'}
  } catch (error) {
    throw error
  }
}
export { addExpenses, getExpensesByUser, clear_Expense, updateExpense };
