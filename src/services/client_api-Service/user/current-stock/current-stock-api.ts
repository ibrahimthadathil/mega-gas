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

export const getInventoryDetails = async()=>{
    try {
        const result = await axios.get('/api/admin/inventory')
        return result.data
    } catch (error) {
        throw error
    }
}

export const getRunning_balance = async (filter: {
  endDate?: string;
  productIds?: string;    // comma-separated
  startDate?: string;
  warehouseIds?: string;  // comma-separated
}) => {
  try {
    const result = await axios.get('/api/user/running-balance', {
      params: {
        endDate: filter?.endDate,
        productIds: filter?.productIds,    // "id1,id2,id3"
        startDate: filter?.startDate,
        warehouseIds: filter?.warehouseIds,
      }
    });
    return result.data;
  } catch (error) {
    throw error;
  }
};