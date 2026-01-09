import { get_All_Unload_Details } from "@/repository/user/unload/unloadRepository";

const getAllUnloadDetails = async () => {
  try {
    const data = await get_All_Unload_Details()
    if(data)return {success:true,data}
    else return {success:false}
  } catch (error) {
    return { success: true, message: (error as Error).message };
  }
};

export {getAllUnloadDetails}
