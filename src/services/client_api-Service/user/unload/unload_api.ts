import axios from "axios"

export const getAllUnloadDetails = async()=>{
    try {
        const result = await axios.get('/api/user/unload')
        return result.data
    } catch (error) {
        throw error
    }
}

export const deleteUnloadSlip = async(id:string)=>{
    try {
        const {data} = await axios.delete(`/api/user/unload/${id}`)
        return data
    } catch (error) {
        throw error
    }
}