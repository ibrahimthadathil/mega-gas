import { TripFormData } from "@/app/(UI)/user/stock/_UI/trip-sheet"
// import { StockTransferFormData } from "@/app/(UI)/user/stock/transfer/_UI/stock-transfer-section"
import axios from "axios"



export const transferStock = async (data:any) => {
    try {
        const result = await axios.post('/api/user/stock/transfer',data)
        return result.data
    } catch (error) {
        throw error
    }
}



