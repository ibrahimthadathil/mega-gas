import { Warehouse } from "@/app/(UI)/user/warehouses/page";
import axios from "axios";

export const addNew_wareHouse = async (data: {
  name: string;
  type: string;
}) => {
  try {
    const result = await axios.post("/api/user/warehouse", data);
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const getWarehouse = async () => {
  try {
    const { data } = await axios.get("/api/user/warehouse");
    return data;
  } catch (error) {
    throw error;
  }
};

export const editWarehouse = async (editData: Warehouse) => {
  try {
    const { data } = await axios.put(`/api/user/warehouse/${editData.id}`, editData);
    return data;
  } catch (error) {
    throw error;
  }
};
