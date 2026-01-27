import axios from "axios"
import { TripFormData } from "@/app/(UI)/user/stock/_UI/trip-sheet"

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

export const getLoadslipByLoad = async (id:string)=>{  // get individual unload data
    try {
        const result = await axios.get(`/api/user/unload/${id}`)
        return result.data
    } catch (error) {
        throw error
    }
}


export const unloadSlip  = async(data:TripFormData)=>{   // unload load
    try {
        const result = await axios.post('/api/user/stock',data)
        return result.data
    } catch (err) {
        throw err
    }
}

export const updateUnloadSlip = async(data:any)=>{
    try {
        const result = await axios.post('/api/user/stock',data)
        return result.data
    } catch (error) {
        throw error
    }
}