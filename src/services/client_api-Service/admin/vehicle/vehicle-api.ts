import { Vehicle } from "@/types/types";
import axios from "axios";

export const addVehicle = async (data: Vehicle) => {
  try {
  const result = await axios.post("/api/admin/vehicle", data);
  return result.data
  } catch (error) {
    throw error;
  }
};


export const getAllVehicles = async()=>{
  try {
    const result = await axios.get('/api/admin/vehicle')    
    return result.data
  } catch (error) {
    throw error
  }
}
