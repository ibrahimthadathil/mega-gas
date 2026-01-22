import supabase from "@/lib/supabase/supabaseClient";

const addPurchaseRegister = async (payload: Record<string, unknown>) => {
  //   const payloads = {
  //   "p_register": {
  //     "sap_number": "PL-2025-0001",
  //     "bill_date": "2025-11-25",
  //     "created_by": "5ba724f3-e625-4b82-912c-5f7a080263c9",
  //     "created_at": "2025-11-25T08:30:00+00:00",
  //     "tax_invoice_number": "TINV-55555",
  //     "warehouse_id": "0343d705-ba8f-47bc-a49e-d1c8907efd5b"
  //   },
  //   "p_line_items": [
  // {
  //       "product_id": "5ad42421-df1d-4902-91d1-ae7af7123c15",
  //       "full_qty": 5,
  //       "trip_type": "oneway",
  //       "return_product_id": "18b9c107-3ee2-486f-bdb0-df895b5a40ee",
  //       "return_qty": 5,
  //       "created_by": "5ba724f3-e625-4b82-912c-5f7a080263c9",
  //       "created_at": "2025-11-25T08:32:00+00:00"
  //     },
  //     {
  //       "product_id": "5ad42421-df1d-4902-91d1-ae7af7123c15",
  //       "full_qty": 15,
  //       "trip_type": "two_way",
  //       "return_product_id": "18b9c107-3ee2-486f-bdb0-df895b5a40ee",
  //       "return_qty": 15,
  //       "created_by": "5ba724f3-e625-4b82-912c-5f7a080263c9",
  //       "created_at": "2025-11-25T08:32:00+00:00"
  //     }
  //   ]
  // }
  try {
    const { error } = await supabase.rpc(
      "create_plant_load_with_lines",
      payload
    );
    if (error) throw error;
    return true;
  } catch (error) {
    console.log((error as Error).message);
    throw (error as Error).message;
  }
};

const getMaterializedProduct = async () => {
  try {
    const { data, error } = await supabase
      .from("materialized_products_cache")
      .select("*");
    if (error) throw error;
    return data;
  } catch (error) {
    throw (error as Error).message;
  }
};

const getProductForPurchase = async () => {
  try {
    const { data, error } = await supabase
      .from("materialized_products_cache")
      .select("*")
      .ilike("product_name", "% FULL");
    if (error) throw error;
    return data;
  } catch (error) {
    console.log((error as Error).message);
    throw error;
  }
};

// const getPurchaseRegister = async (userId: string, role: string) => {
//   try {
//     let query = supabase
//       .from("plant_load_register_view")
//       .select("*")
//       .order("created_at", { ascending: false });
      
//     if (role === "plant_driver") query = query.eq("created_by", userId);

//     const { data, error } = await query;
//     if (error) throw error;    
//     return data;
//   } catch (error) {
//     console.log((error as Error).message);

//     throw (error as Error).message;
//   }
// };


interface FilterParams {

  startDate?: string;
  endDate?: string;
  warehouse?: string;
  isUnloaded?: string;
  page: number;
  limit: number;
}

// Alternative version with even more debugging
const getPurchaseRegister = async (
  userId: string,
  role: string,
  filter: FilterParams
) => {
  try {
    // console.log("=== Purchase Register Query Start ===");
    // console.log("User ID:", userId);
    // console.log("Role:", role);
    // console.log("Filters:", JSON.stringify(filter, null, 2));

    // Set default values for pagination
    const page = filter.page || 1;
    const limit = filter.limit || 10;

    // First, let's check if the table has any data at all
    const { data: allData, error: testError } = await supabase
      .from("plant_load_register_view")
      .select("*")
      .limit(1);

    // console.log("Test query (first row):", { allData, testError });

    // Start building the actual query
    let query = supabase
      .from("plant_load_register_view")
      .select("*", { count: "exact" });

    // Apply role-based filtering
    if (role === "plant_driver") {
      // console.log("Applying plant_driver filter for userId:", userId);
      query = query.eq("created_by", userId);
    }

    // Apply date filters only if provided
    if (filter.startDate && filter.endDate) {
      if (filter.startDate === filter.endDate) {
        // console.log("Filtering by single date:", filter.startDate);
        query = query.eq("bill_date", filter.startDate);
      } else {
        // console.log("Filtering by date range:", filter.startDate, "to", filter.endDate);
        query = query
          .gte("bill_date", filter.startDate)
          .lte("bill_date", filter.endDate);
      }
    } else if (filter.startDate) {
      // console.log("Filtering from start date:", filter.startDate);
      query = query.gte("bill_date", filter.startDate);
    } else if (filter.endDate) {
      // console.log("Filtering to end date:", filter.endDate);
      query = query.lte("bill_date", filter.endDate);
    } else {
      // console.log("No date filters applied");
    }

    // Apply warehouse filter
    if (filter.warehouse) {
      // console.log("Filtering by warehouse:", filter.warehouse);
      query = query.eq("warehouse_name", filter.warehouse);
    }

    // Apply unload status filter
    if (filter.isUnloaded !== undefined && filter.isUnloaded !== "") {
      const unloadedStatus = filter.isUnloaded === "true";
      // console.log("Filtering by unload status:", unloadedStatus);
      query = query.eq("is_unloaded", unloadedStatus);
    }

    // Order by created_at descending (most recent first)
    query = query.order("created_at", { ascending: false });

    // Apply pagination
    const offset = (page - 1) * limit;
    // console.log("Pagination:", { page, limit, offset, range: [offset, offset + limit - 1] });
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    // console.log("=== Query Results ===");
    // console.log("Error:", error);
    // console.log("Count:", count);
    // console.log("Data length:", data?.length);
    // console.log("First item:", data?.[0]);

    if (error) {
      console.error("Supabase query error:", error);
      throw error;
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return {
      success: true,
      data: data || [],
      total: count || 0,
      totalPages,
      message: "Plant load register retrieved successfully",
    };
  } catch (error) {
    console.error("=== Error in getPurchaseRegister ===");
    console.error("Error:", error);
    return {
      success: false,
      data: [],
      total: 0,
      totalPages: 0,
      message: (error as Error).message,
    };
  }
};
const delete_purchase = async (id: string) => {
  try {
    const { error } = await supabase.rpc("delete_plant_load_register", {
      p_register_id: id,
    });
    if (error) throw error;
    return true;
  } catch (error) {
    throw error;
  }
};

const edit_Purchased_Load = async (
  registerId: string,
  registerPayload: Record<string, unknown>,
  lineItemsPayload: Record<string, any>
) => {
  try {
    const { error } = await supabase.rpc("edit_plant_load_register", {
      p_register_id: registerId,
      p_register: registerPayload,
      p_line_items: lineItemsPayload,
    });
    if (error) throw error;
    return true;
  } catch (error) {
    console.log((error as Error).message);
    throw error;
  }
};

export {
  addPurchaseRegister,
  getProductForPurchase,
  getMaterializedProduct,
  getPurchaseRegister,
  delete_purchase,
  edit_Purchased_Load,
};
