import supabase from "@/lib/supabase/supabaseClient";
// to add new account name
const addNewAccount = async (payload: { accountName: string }) => {
  try {
    const { data, error } = await supabase
      .from("accounts")
      .insert(payload)
      .select();
    if (error) throw error;
    return true;
  } catch (error) {
    console.log((error as Error).message);
    throw error;
  }
};

// get all accounts

const getAccountNames = async () => {
  try {
    const { data, error } = await supabase.from("accounts").select("*");
    if (error) return error;
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

export { addNewAccount, addNewLineItem, getAccountNames };
