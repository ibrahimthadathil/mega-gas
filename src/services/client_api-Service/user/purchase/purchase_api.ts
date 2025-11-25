import axios from "axios";

export const getPurchaseCredentials = async () => {
  try {
    const result = await axios.get("/api/user/purchase/credential");
    return result.data;
  } catch (error) {
    throw (error as Error).message;
  }
};

export const addPurchaseRegister = async (data:any) => {
  try {
    const result = await axios.post('/api/user/purchase',data)
    return result.data
  } catch (error) {
    throw (error as Error).message;
  }
};
