import axios from "axios"

// to view all the transferd stock
export const getTransferedStockSTatus = async()=>{
    try {
       const result = await axios.get('/api/user/stock') 
       return result.data
    } catch (error) {
        throw error
    }
}