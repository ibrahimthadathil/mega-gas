import { addNewLineItem, delete_transaction, edit_transaction, getAll_transactions } from "@/repository/user/accounts/transaction/transactionRepository";

const createNewTransaction = async (newTransaction: any, userId: string) => {
  try {
    const { source_form_reference_id, ...lineItem } = newTransaction.line_Item;
    const payload = {
      p_line_item: {
        ...lineItem,
        created_by: userId,
      },
      p_cash_chest: {
        chest_name: "default",
        ...newTransaction.cash_chest,
        created_by: userId,
      },
    };

    const result = await addNewLineItem(payload);
    if (result) return { success: true };
    else return { success: false };
  } catch (error) {
    console.log((error as Error).message);

    throw error;
  }
};

const getAllTransaction = async()=>{
  try {
    const result = await getAll_transactions()
    if(result)return { success:true , result}
    else return {success:false}
  } catch (error) {
    console.log((error as Error).message);
    throw error
  }
}

const deleteTransactionAccount = async(id:string)=>{
  try {
    const deleted = await delete_transaction(id)
    if(deleted)return {success:true}
    else return {success:false}
  } catch (error) {
    throw error
  }
}

const editTransaction = async (id: string, updatedTransaction: any, userId: string) => {
  try {
    const { source_form_reference_id, ...lineItem } = updatedTransaction.line_Item;
    const {account_name,created_at,...rest} = lineItem
    console.log(updatedTransaction.cash_chest,'😶‍🌫️😶‍🌫️');
    
    const payload = {
      p_line_item_id: id,
      p_line_item: {
        ...rest,
      },
      p_cash_chest: {
        chest_name: "default",
        ...updatedTransaction.cash_chest,
      },
    };

    const result = await edit_transaction( payload);
    if (result) return { success: true };
    else return { success: false };
  } catch (error) {
    console.log((error as Error).message);
    throw error;
  }
};

export { createNewTransaction,getAllTransaction,deleteTransactionAccount,editTransaction };
