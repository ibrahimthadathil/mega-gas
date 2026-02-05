import { UnloadFilters } from "@/types/unloadSlip";
<<<<<<< HEAD
import axios from "axios"
=======
import axios from "axios";
>>>>>>> 6dae87681bd68e514ea651efef36e277bc685d62

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

export const deleteUnloadSlip = async (id: string) => {
  try {
    const { data } = await axios.delete(`/api/user/unload/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};
