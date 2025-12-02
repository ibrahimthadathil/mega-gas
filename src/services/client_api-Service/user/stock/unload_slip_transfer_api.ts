import { TripFormData } from "@/app/(UI)/user/stock/_UI/trip-sheet"
import axios from "axios"

export const unloadSlip  = async(data:TripFormData)=>{
    try {
        const result = await axios.post('/api/user/stock',data)
        return result.data
    } catch (err) {
        throw err
    }
}