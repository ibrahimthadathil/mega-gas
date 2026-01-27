import { delete_unload_slip, get_All_Unload_Details } from "@/repository/user/unload/unloadRepository";
import { checkUserByAuthId } from "@/repository/user/userRepository";

const getAllUnloadDetails = async () => {
  try {
    const data = await get_All_Unload_Details();
    if (data) return { success: true, data };
    else return { success: false };
  } catch (error) {
    return { success: true, message: (error as Error).message };
  }
};

const deleteUnloadSlipById = async (id:string,authId:string) => {
  try {
    const checkUser = await checkUserByAuthId(authId)
    if(checkUser){
      const isDeleted = await delete_unload_slip(id,checkUser.id)
      if(isDeleted)return {success:true,message:"deleted"}
      else return {success:false,message:'Failed to delete, Try later'}
    } throw new Error('Unauthorized')
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

const editUnloadSlip = async(data:any,slipId:String)=>{
  try {
    console.log("slipId",slipId);
    console.log("data from front",data);
    
    return {succes:true,message:'slip updated'}
  } catch (error) {
    return {success:false, message:(error as Error).message}
  }
}
export { getAllUnloadDetails, deleteUnloadSlipById, editUnloadSlip };
