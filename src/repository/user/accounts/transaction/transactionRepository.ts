import supabase from "@/lib/supabase/supabaseClient";
import { lineItemFilterProps } from "@/types/transaction ";

// const getAll_transactions = async (filter?: lineItemFilterProps) => {
//   try {
//     const { data, error } = await supabase
//       .from("account_line_items_with_cash_chest")
//       .select("*");

//     if (error) throw error;
//     return data;
//   } catch (error) {
//     throw error;
//   }
// };
// to set a new transaction
const getAll_transactions = async (
  filter?: lineItemFilterProps & { page?: number; limit?: number },
) => {
  try {
    const page = filter?.page ?? 1;
    const limit = filter?.limit ?? 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("account_line_items_with_cash_chest")
      .select("*", { count: "exact" })
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    // Apply filters
    if (filter?.account_name) {
      query = query.ilike("account_name", `%${filter.account_name}%`);
    }

    if (filter?.date) {
      query = query.eq("date", filter.date);
    }

    if (filter?.source_form) {
      query = query.eq("source_form", filter.source_form);
    }

    if (filter?.type) {
      if (filter.type === "amount_received") {
        query = query.gt("amount_received", "0");
      } else if (filter.type === "amount_paid") {
        query = query.gt("amount_paid", "0");
      }
    }

    // Apply pagination
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return { data, total: count ?? 0 };
  } catch (error) {
    throw error;
  }
};
const addNewLineItem = async (payload: any) => {
  try {
    const { error } = await supabase.rpc(
      "insert_line_item_and_cash_chest",
      payload,
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

const edit_transaction = async (payload: any) => {
  try {
    const { error } = await supabase.rpc("update_account_transaction", payload);
    if (error) throw error;

    return true;
  } catch (error) {
    console.log((error as Error).message);
    throw error;
  }
};

const get_account_summary = async (payload?:{account?:string,year?:number,month?:number}) => {
  try {
    const { data , error } = await supabase.rpc("get_account_ledger_monthly",{
      p_account_id:payload?.account,
      p_year:payload?.year,
      p_month:payload?.month
    })
    if(error) throw error
    return data
  } catch (error) {
    throw error
  }
};

export {
  getAll_transactions,
  addNewLineItem,
  delete_transaction,
  edit_transaction,
  get_account_summary
};
