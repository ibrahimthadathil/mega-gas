import { addNewLineItem } from "@/repository/user/accounts/accountsRepository";

const createNewTransaction = async (newTransaction:any,userId:string) => {

  try {
    // const result = await addNewLineItem()
    if (true) return { success: true };
    else return { success: false };
  } catch (error) {
    throw error;
  }
};

export { createNewTransaction };
