import axios from "axios"

export const getAllUnloadDetails = async()=>{
    try {
        const result = await axios.get('/api/user/unload')
        return result.data
    } catch (error) {
        throw error
    }
}