import { FilterParams } from "@/app/(UI)/admin/sales-report/page";
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

// export const getAllDeliveryReport = async()=>{
//   try {
//     const {data} = await axios.get('/api/admin/sales')
//     return data
//   } catch (error) {
//     throw error
//   }
// }
export const getAllDeliveryReport = async (filters?: FilterParams) => {
  try {
    const params = new URLSearchParams();
    
    if (filters?.startDate) {
      params.append('startDate', filters.startDate);
    }
    if (filters?.endDate) {
      params.append('endDate', filters.endDate);
    }
    if (filters?.status) {
      params.append('status', filters.status);
    }
    if (filters?.users) {
      params.append('users', filters.users);
    }
    if (filters?.chest) {
      params.append('chest', filters.chest);
    }

    const queryString = params.toString();
    const url = `/api/admin/sales${queryString ? `?${queryString}` : ''}`;
    
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    throw error;
  }
};