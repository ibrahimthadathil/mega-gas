import {
  addNewAccount,
  getAccountNames,
} from "@/repository/user/accounts/accountsRepository";
import { checkUserByAuthId } from "@/repository/user/userRepository";

const createNewAccount = async (data: any) => {
  try {
    const checkUser = await checkUserByAuthId(data?.created_by as string);
    if (checkUser) data.created_by = checkUser.id;
    else throw new Error("un-authorized");
    const result = await addNewAccount(data);
    if (result) return { success: true };
    else return { success: false, message: "Failed to Execute" };
  } catch (error) {
    throw error;
  }
};

const getAllAccounts = async () => {
  try {
    const result = await getAccountNames();
    if (result) return { success: true, result };
    else return { success: false };
  } catch (error) {
    throw error;
  }
};
export { createNewAccount, getAllAccounts };
