import { TripFormData } from "@/app/(UI)/user/stock/_UI/trip-sheet"
// import { StockTransferFormData } from "@/app/(UI)/user/stock/transfer/_UI/stock-transfer-section"
import axios from "axios"

export const unloadSlip  = async(data:TripFormData)=>{
    try {
        const result = await axios.post('/api/user/stock',data)
        return result.data
    } catch (err) {
        throw err
    }
}

export const transferStock = async (data:any) => {
    try {
        const result = await axios.post('/api/user/stock/transfer',data)
        return result.data
    } catch (error) {
        throw error
    }
}

export const getLoadslipByLoad = async (id:string)=>{
    try {
        const result = await axios.get(`/api/user/stock/${id}`)
        return result.data
    } catch (error) {
        throw error
    }
}

export const updateUnloadSlip = async(id:string,data:any)=>{
    try {
        const result = await axios.put(`/api/user/unload/${id}`,data)
        return result.data
    } catch (error) {
        
    }
}

