  import { userLogIn } from "@/repository/user/auth/user-authRepository";

  const userLoginService = async (credential: {
    email: string;
    password: string;
  }) => {
    try {
      const {session,profile,success,message} = await userLogIn(credential.email, credential.password)
      if(success)return {success,access_token:session?.access_token,refresh_token:session?.refresh_token,profile,message:'Logged In Successfully'}
      else return { success,message }
    } catch (error) {
      console.log((error as Error).message);
      throw new Error((error as Error).message)
    }
  };

  export { userLoginService };
