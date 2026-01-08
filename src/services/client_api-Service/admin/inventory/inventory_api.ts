import axios from "axios"

export const getInventoryDetails = async()=>{
    try {
        const result = await axios.get('/api/admin/inventory')
        return result.data
    } catch (error) {
        throw error
    }
}