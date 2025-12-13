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

const addNewLineItem = async () => {
  const payload = {
    p_line_item: {
      date: "2025-01-14",
      account_name: "Musthafakka",
      account_id: "6d1b9d9e-5556-40c4-a0ea-f6e9ef6423ac",
      amount_received: 0,
      amount_paid: 8500,
      source_form: "Expence",
      remarks: "",
      created_by: "5ba724f3-e625-4b82-912c-5f7a080263c9",
      created_at: "2025-01-14T13:20:00Z",
    },
    p_cash_chest: {
      chest_name: "default",
      note_500: 15,
      note_200: 65,
      note_100: 75,
      note_50: 25,
      note_20: 65,
      note_10: 45,
      coin_5: 6,
      source_reference_type: "payments-receipts",
      created_by: "5ba724f3-e625-4b82-912c-5f7a080263c9",
      created_at: "2025-01-14T13:20:00Z",
    },
  };

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
