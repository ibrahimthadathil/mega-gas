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
    const { data } = await axios.put(`/api/admin/sales/${id}`, datas);
    return data;
  } catch (error) {
    throw error;
  }
};


export const getAllDeliveryReport = async (filters?: FilterParams) => {
  try {
    
    const { data } = await axios.get("/api/admin/sales", {
      params: {
        status: filters?.status,
        users: filters?.users,
        startDate: filters?.startDate,
        endDate: filters?.endDate,
        chest: filters?.chest,
        page:filters?.page||1,
        limit:filters?.limit||16
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
