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

export const getRunning_balance = async (filter:{
  endDate?: string;
  productId?: string;
  startDate?: string;
  warehouseId?: string;
})=>{
  try {
    const result = await axios.get('/api/user/running-balance',{
      params:{
        endDate:filter?.endDate ,
        productId:filter?.productId,
        startDate:filter?.startDate,
        warehouseId:filter?.warehouseId
      }
    })
    return result.data
  } catch (error) {
    throw error
  }
}