import {
  edit_user,
  get_All_User,
  remove_User,
} from "@/repository/admin/ums/ums-repository";
import {
  findUserById,
} from "@/repository/user/userRepository";
import { IUser } from "@/types/types";

const getAllUsers = async () => {
  try {
    const result = await get_All_User();
    if (result) return { success: true, data: result };
    else return { success: false };
  } catch (error) {
    throw error;
  }
};

const delete_user = async (userId: string) => {
  try {    
    const existUser = await findUserById(userId) as unknown as IUser;
    
    if (existUser) {      
      const { success } = await remove_User(
        existUser?.auth_id as string,
        existUser?.id as string
      );

      if (success) return true;
    } else throw Error("User Not found");
  } catch (error) {
    console.log((error as Error).message);
    
    throw error;
  }
};

const editUser = async(userId:string,data:IUser)=>{
  try {
    console.log(userId,'0000',data);
    
    const s = await edit_user(data,userId)
  } catch (error) {
    throw error
  }
}

export { getAllUsers, delete_user, editUser };
