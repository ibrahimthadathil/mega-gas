import { userLogIn } from "@/repository/user/auth/user-authRepository";
import { getUserByRole } from "@/repository/user/userRepository";

const userLoginService = async (credential: {
  email: string;
  password: string;
}) => {
  try {
    const { session, profile, success, message } = await userLogIn(
      credential.email,
      credential.password
    );
    if (success)
      return { success, session, profile, message: "Logged In Successfully" };
    else return { success, message };
  } catch (error) {
    console.log((error as Error).message);
    throw new Error((error as Error).message);
  }
};

const get_UserByRole = async (role: string) => {
  try {
    const result = await getUserByRole(role);
    if(result) return {success:true,result}
    else return {success:false}
  } catch (error) {
    console.log((error as Error).message);
    throw new Error((error as Error).message);
  }
};

export { userLoginService, get_UserByRole };
