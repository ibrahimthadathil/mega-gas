import { CashAdjustmentForm } from "@/components/accounts/denominatio"
import axios from "axios"

export const getDayBook = async(filter:any)=>{
    try {
        const result = await axios.get('/api/user/day-book',{
            params:{
                date:filter.date,
                chest:filter.chest,
                status:filter.status,
                types:filter.types
            }
        })        
        return result.data
    } catch (error) {
        throw error
    }
}