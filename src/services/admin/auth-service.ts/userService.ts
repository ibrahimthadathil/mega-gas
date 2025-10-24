import {
  createUserProfile,
  creatUserAuth,
  findByEmail,
} from "@/repository/admin/admin-repository";
import { IUser, STATUS } from "@/types/types";

const add_User = async (userData: IUser) => {
  try {
    const existUser = await findByEmail(userData.email);
    if (existUser) return {success:false,message:'User Already Exist',status:STATUS.CONFLICT.code}
    const authUser = await creatUserAuth(userData.email, userData.password);
    const profile = await createUserProfile({
      auth_id: authUser.id,
      user_name: userData.user_name,
      email: userData.email,
      role: userData.role,
      phone: userData.phone,
    });
    if (profile) return { success: true ,message: 'Created Succesfully' , status:STATUS.CREATED.code};
    else throw new Error("failed to add user");
  } catch (error) {
    console.log((error as Error).message);
    throw error;
  }
};

export { add_User };
