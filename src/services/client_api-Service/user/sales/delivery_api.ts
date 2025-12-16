import axios from "axios";

export const getOldStock = async (id: string) => {
  try {
    const result = await axios.get(`/api/user/delivery/${id}`);
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllDeliverableProducts = async ()=>{
  try {
    const result = await axios.get('/api/user/delivery')
    return result.data
  } catch (error) {
   throw error 
  }
}
