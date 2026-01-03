import { Expense } from "@/types/types";
import axios from "axios";

export const add_expense = async (data: Expense) => {
  try {
    const result = await axios.post("/api/user/expense", data);
    return result.data;
  } catch (error) {
    throw error
  }
};

export const get_expenses = async () => {
  try {
    const result = await axios.get("/api/user/expense");
    return result.data;
  } catch (error) {
    throw error
  }
};

export const delete_expense = async (id: string) => {
  try {
    const result = await axios.delete(`/api/user/expense/${id}`);    
    return result.data;
  } catch (error) {
    throw error
  }
};




export const get_userByRole = async(role:string)=>{
  try {
    const result = await axios.get(`/api/user/auth/${role}`)
    return result.data
  } catch (error) {
    throw error
  }
}