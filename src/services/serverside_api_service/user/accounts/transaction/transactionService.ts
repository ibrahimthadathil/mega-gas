import { addNewLineItem } from "@/repository/user/accounts/accountsRepository";

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

export { createNewTransaction };
