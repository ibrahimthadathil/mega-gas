import axios from "axios";

export const getVehiclePayload = async (id: string) => {
  try {
    const result = await axios.get(`/api/user/delivery/${id}`);
    return result.data.data;
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

export const recordDelivery = async (data:any) => {
  try {
    const result = await axios.post('/api/user/delivery',data)
    return result.data
  } catch (error) {
    throw error
  }
}

// get Daily report by the user 

export const getDailyReportByUser = async()=>{
  try {
    const {data} = await axios.get('/api/user/delivery') 
    return data
  } catch (error) {
    throw error
  }
}
