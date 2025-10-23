import {
  createUserProfile,
  creatUserAuth,
  findByEmail,
} from "@/repository/admin/admin-repository";
import { IUser } from "@/types/types";

const add_User = async (userData: IUser) => {
  try {
    const existUser = await findByEmail(userData.email);
    if (existUser) throw new Error("User already exist");
    const authUser = await creatUserAuth(userData.email, userData.password);
    console.log(authUser);
    
    const profile = await createUserProfile({
      auth_id: authUser.id,
      username: userData.username,
      email: userData.email,
      role: userData.role,
      phone: userData.phone,
    });
    if (profile) return { success: true };
    else throw new Error("failed to add user");
  } catch (error) {
    throw error;
  }
};

export { add_User };
