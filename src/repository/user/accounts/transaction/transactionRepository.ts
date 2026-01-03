import supabase from "@/lib/supabase/supabaseClient";

const getAll_transactions = async () => {
  try {
    const { data, error } = await supabase
      .from("account_line_items_with_cash_chest")
      .select("*");

    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};
// to set a new transaction

const addNewLineItem = async (payload: any) => {
  try {
    const { error } = await supabase.rpc(
      "insert_line_item_and_cash_chest",
      payload
    );

    if (error) throw error;
    return true;
  } catch (err) {
    console.error("RPC error:", (err as Error).message || err);
    throw err;
  }
};

const delete_transaction = async (id: string) => {
  try {
    const { error } = await supabase.rpc("delete_account_transaction", {
      p_line_item_id: id,
    });
    if (error) throw error;
    return true;
  } catch (error) {
    console.log((error as Error).message);

    throw error;
  }
};

const edit_transaction = async ( payload: any) => {
  try {
    console.log('@@',payload);
    
    const { error } = await supabase.rpc(
  'update_account_transaction',
  payload
);    
if(error) throw error
  
    return true;
  } catch (error) {
    console.log((error as Error).message);
    throw error;
  }
};
export { getAll_transactions, addNewLineItem, delete_transaction,edit_transaction };
