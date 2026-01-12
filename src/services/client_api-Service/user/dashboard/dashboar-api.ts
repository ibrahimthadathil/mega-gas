import axios from "axios"


export const getDashboardData = async()=>{
    try {
        const {data} = await axios.get('/user/dashboard')
        return data
    } catch (error) {
        throw error
    }
}