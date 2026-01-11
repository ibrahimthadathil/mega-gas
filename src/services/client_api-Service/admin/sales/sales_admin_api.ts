import axios from "axios"

export const deleteDailyReport = async(id:string)=>{
try {
    const {data} = await axios.delete(`/api/admin/sales/${id}`)
    return data
} catch (error) {
    throw error
}
}