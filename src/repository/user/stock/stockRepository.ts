import supabase from "@/lib/supabase/supabaseClient";
import { TransferStockFilters } from "@/types/stock";

const unload_Slip = async (payload: Record<string, unknown>) => {
  try {
    const { error } = await supabase.rpc("unload_slip_insert", payload);
    if (error) throw error;
    return true;
  } catch (error) {
    console.log((error as Error).message);
    throw (error as Error).message;
  }
};

const stock_Transfer = async (data: Record<string, unknown>) => {
  try {
    // const payload = {
    //   payload: {
    //     date: "2025-12-01",
    //     "product id": "5ad42421-df1d-4902-91d1-ae7af7123c15",
    //     // "product id": "18b9c107-3ee2-486f-bdb0-df895b5a40ee",
    //     qty: 25,
    //     // "from warehouse": "4557aa99-60d9-452b-bb7d-3d1d487dbe33", // chelari
    //     "from warehouse": "5ea32457-d1d2-4c10-a90c-f0fc4de70ffb", // s sathyan
    //     "to warehouse": "99a57515-d36a-42ec-8d63-8a72d2b95ab2", // saleem
    //     Empty_inclusive: true,
    //     "return product id": "18b9c107-3ee2-486f-bdb0-df895b5a40ee",
    //     "return qty": 25,
    //     "return from warehouse": "99a57515-d36a-42ec-8d63-8a72d2b95ab2", //saleem
    //     "return to warehouse": "5ea32457-d1d2-4c10-a90c-f0fc4de70ffb", //sathyan
    //     // "return to warehouse": "4557aa99-60d9-452b-bb7d-3d1d487dbe33",
    //     remarks: "Trial run",
    //     "created by": "5ba724f3-e625-4b82-912c-5f7a080263c9",
    //     "created at": "2025-12-01T11:30:00Z",
    //   },
    // };
    const { error } = await supabase.rpc("create_stock_transfer", data);
    if (error) throw error;
    return true;
  } catch (error) {
    console.log((error as Error).message);
    throw error;
  }
};

const getpurchasedLoad = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("plant_load_register_view")
      .select("*")
      .eq("id", id);
    if (error) throw error;
    return data;
  } catch (error) {
    console.log((error as Error).message);
    throw error;
  }
};
// this fuction is not using currently
const getAlltransferedStock = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("stock_transfers")
      .select("*")
      .eq("created_by", userId);
    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};

// edit stock transfer

const Edit_stock_transfer = async (transferId: string, payload: Record<string,unknown>) => {
  try {
    const { error } = await supabase.rpc("edit_stock_transfer", {
      p_transfer_id: transferId,
      payload,
    });
    if(error) throw error
    return true
  } catch (error) {
    throw error
  }
};

// view all transfered stock
// const view_Transfered_stock = async () => {
//   try {
//     const { data, error } = await supabase
//       .from("stock_transfer_view")
//       .select("*")
//       .order("created_at", { ascending: false });
//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.log((error as Error).message);

//     throw error;
//   }
// };
const view_Transfered_stock = async (filters: TransferStockFilters = {}) => {
  try {
    const {
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = filters;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("stock_transfer_view")
      .select("*", { count: "exact" }) // 👈 get total count
      .order("created_at", { ascending: false }); // 👈 latest first

    // ✅ Date filters
    if (startDate) {
      query = query.gte("created_at", startDate);
    }

    if (endDate) {
      query = query.lte("created_at", endDate);
    }

    // ✅ Pagination
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data,
      count, // 👈 total rows for pagination UI
      // page,
      // limit,
    };
  } catch (error) {
    console.log((error as Error).message);
    throw error;
  }
};


// delete stock transfer
const delete_stock_transfer = async (transferId: string) => {
  try {
    const { error } = await supabase.rpc("delete_stock_transfer", {
      p_transfer_id: transferId,
    });
    if (error) throw error;
    return true;
  } catch (error) {
    console.log((error as Error).message);
  }
};
export {
  unload_Slip,
  stock_Transfer,
  getpurchasedLoad,
  getAlltransferedStock,
  view_Transfered_stock,
  delete_stock_transfer,
  Edit_stock_transfer
};
