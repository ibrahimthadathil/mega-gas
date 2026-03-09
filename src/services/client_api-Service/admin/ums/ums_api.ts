import { IUser } from "@/types/types"
import axios from "axios"

export const getAllUsers = async () =>{
    try {
        const result = await axios.get('/api/admin/ums')
        return result.data
    } catch (error) {
        throw error
    }
}

export const deleteUser = async (id: string) => {
    try {
        const result = await axios.delete(`/api/admin/ums/${id}`)
        return result.data
    } catch (error) {
        throw error
    }
}

export const editUser = async (user:IUser,id?:string)=> {
    try {        
        const result = await axios.put(`/api/admin/ums/${id}`,user)
        return result.data
    } catch (error) {
       throw error 
    }
}

export const addNewUser = async(data:any)=>{
    try {
        const result = await axios.post('/api/admin/auth',data)
        return result.data
    } catch (error) {
        throw error
    }
}