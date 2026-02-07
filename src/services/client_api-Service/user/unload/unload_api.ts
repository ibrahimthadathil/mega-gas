import { UnloadFilters } from "@/types/unloadSlip";
import axios from "axios"
import { TripFormData } from "@/app/(UI)/user/stock/_UI/trip-sheet"

export const getAllUnloadDetails = async (filter?: UnloadFilters) => {
  try {
    console.log(filter);
    
    const result = await axios.get("/api/user/unload", {
      params: {
        page: filter?.page || 1,
        limit: filter?.limit || 10,
        warehouseId: filter?.warehouseId,
        billDateFrom: filter?.billDateFrom,
        billDateTo: filter?.billDateTo,
        unloadDateFrom: filter?.unloadDateFrom,
        unloadDateTo: filter?.billDateTo,
      },
    });    
    return result.data;
  } catch (error) {
    throw error;
  }
};

<<<<<<< HEAD
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
=======
export const deleteUnloadSlip = async (id: string) => {
  try {
    const { data } = await axios.delete(`/api/user/unload/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};
>>>>>>> stage
