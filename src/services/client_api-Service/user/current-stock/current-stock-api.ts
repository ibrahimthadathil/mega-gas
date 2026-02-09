import axios from "axios";

export const getQTYBywarehouseId = async (data: any) => {
  try {
    const result = await axios.get("/api/user/current-stock", {
      params: {
        warehouseId: data.warehouseId,
        products: data.products,
      },
    });

    return result.data;
  } catch (error) {
    throw error;
  }
};
