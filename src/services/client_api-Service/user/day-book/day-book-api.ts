import api from "@/services/axios-Instance/interceptor"

export const getDayBook = async(filter:any)=>{
    try {
        
        const result = await api.get('/api/user/day-book',{
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