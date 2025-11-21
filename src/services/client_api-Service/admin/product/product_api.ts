import { IProduct } from "@/types/types";
import axios, { Axios } from "axios";

export const addNew_product = async (data: IProduct) => {
  try {
    const result = await axios.post("/api/admin/product", data);
    return result.data;
  } catch (error) {
    throw (error as Error).message;
  }
};

export const getAllProducts = async () => {
  try {
    const result = await axios.get("/api/admin/product");
    return result.data;
  } catch (error) {
    throw error;
  }
};
