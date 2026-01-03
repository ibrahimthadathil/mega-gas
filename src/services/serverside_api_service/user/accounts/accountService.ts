import {
  addNewAccount,
  delete_Account,
  getAccountNames,
  update_Account,
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

const deleteAccountById =async (id:string)=>{
  try {
    const deleted = await delete_Account(id);
    if (deleted) return { success: true };
    else return { success: false, message: "Failed to delete" };
  } catch (error) {
    throw error;
  }
};

const updateAccountById = async (id:string,payload:any)=>{
  try {
    const updated = await update_Account(id,payload);
    if (updated) return { success: true };
    else return { success: false, message: "Failed to update" };
  } catch (error) {
    throw error;
  }
};
export { createNewAccount, getAllAccounts, deleteAccountById, updateAccountById };
