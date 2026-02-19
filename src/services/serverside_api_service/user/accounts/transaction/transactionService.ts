import { adjustCashChest } from "@/lib/helper/cashAdjust";
import {
  addNewLineItem,
  delete_transaction,
  edit_transaction,
  get_account_summary,
  getAll_transactions,
} from "@/repository/user/accounts/transaction/transactionRepository";
import { checkUserByAuthId } from "@/repository/user/userRepository";
import { lineItemFilterProps } from "@/types/transaction ";

const createNewTransaction = async (newTransaction: any, userId: string) => {
  try {
    const user = await checkUserByAuthId(userId);

    const { source_form_reference_id, ...lineItem } = newTransaction.line_Item;

    const isPaid = lineItem.amount_paid > 0;

    const payload = {
      p_line_item: {
        ...lineItem,

        created_by: user?.id,
      },
      p_cash_chest: {
        chest_name: "office",
        ...adjustCashChest(newTransaction.cash_chest, isPaid),

        created_by: user?.id,
      },
    };

    const result = await addNewLineItem(payload);

    return result ? { success: true } : { success: false };
  } catch (error) {
    console.log((error as Error).message);
    throw error;
  }
};

const getAllTransaction = async (filter?: lineItemFilterProps) => {
  try {
    const { data, total } = await getAll_transactions(filter);
    if (data) return { success: true, data, total };
    else return { success: false };
  } catch (error) {
    console.log((error as Error).message);
    throw error;
  }
};

const deleteTransactionAccount = async (id: string) => {
  try {
    const deleted = await delete_transaction(id);
    if (deleted) return { success: true };
    else return { success: false };
  } catch (error) {
    throw error;
  }
};

const editTransaction = async (
  id: string,
  updatedTransaction: any,
  userId: string,
) => {
  try {
    const { source_form_reference_id, ...lineItem } =
      updatedTransaction.line_Item;
    const { account_name, created_at, ...rest } = lineItem;
    const payload = {
      p_line_item_id: id,
      p_line_item: {
        ...rest,
      },
      p_cash_chest: {
        chest_name: "office",
        ...updatedTransaction.cash_chest,
      },
    };

    const result = await edit_transaction(payload);
    if (result) return { success: true };
    else return { success: false };
  } catch (error) {
    console.log((error as Error).message);
    throw error;
  }
};

const getLedger = async(data?:{account?:string,year?:number,month?:number})=>{
  try {
   const result =  await get_account_summary(data)
   if(result) return {success:true, data:result}
   else return {success:false,data:[]}
  } catch (error) {
    return {success:false , message:(error as Error).message}
  }
}

export {
  createNewTransaction,
  getAllTransaction,
  deleteTransactionAccount,
  editTransaction,
  getLedger
};
