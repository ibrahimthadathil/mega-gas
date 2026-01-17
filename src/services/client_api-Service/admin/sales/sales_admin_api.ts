import axios from "axios";

export const deleteDailyReport = async (id: string) => {
  try {
    const { data } = await axios.delete(`/api/admin/sales/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getDeliveryDetailsById = async (id: string) => {
  try {
    const { data } = await axios.get(`/api/admin/sales/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateSalesSlip = async (datas: any, id: string) => {
  try {
    const { data } = await axios.put(`/api/admin/sales/${id}`,datas);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getAllDeliveryReport = async()=>{
  try {
    const {data} = await axios.get('/api/admin/sales')
    return data
  } catch (error) {
    throw error
  }
}
