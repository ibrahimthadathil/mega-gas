import axios from "axios"


export const getDashboardData = async(filters:any)=>{
    console.log(filters);
    
    try {
        const {data} = await axios.get(`/api/user/dashboard`)
        return data
    } catch (error) {
        throw error
    }
}