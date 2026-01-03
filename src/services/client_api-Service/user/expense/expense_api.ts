import { Expense } from "@/types/types"
import axios from "axios"

export const updateExpense = async (id:string,data:Partial<Expense>)=>{
    try {        
        const result = await axios.put(`/api/user/expense/${id}`,data)
        return result.data
    } catch (error) {
        throw error
    }
}