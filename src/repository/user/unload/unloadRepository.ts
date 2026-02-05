import supabase from "@/lib/supabase/supabaseClient";
import { UnloadFilters } from "@/types/unloadSlip";

// const get_All_Unload_Details = async () => {
//   try {
//     const { data, error } = await supabase
//       .from("plant_load_unload_view")
//       .select("*")
//       .order("unload_date", { ascending: true, nullsFirst: true })
//       .order("bill_date", { ascending: true }); // change this after

//     if (error) throw error;
//     return data;
//   } catch (error) {
//     throw error;
//   }
// };

const get_All_Unload_Details = async (filters: UnloadFilters = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      warehouseId,
      billDateFrom,
      billDateTo,
      unloadDateFrom,
      unloadDateTo,
    } = filters;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("plant_load_unload_view")
      .select("*", { count: "exact" })
      .order("unload_date", { ascending: true, nullsFirst: true })
      .order("bill_date", { ascending: true });

    // 🔹 Warehouse filter (JSON string column case)
    if (warehouseId) {
      // If warehouse is stored as JSON string, use ilike
      query = query.filter("warehouse->>id", "eq", warehouseId);
    }

    // 🔹 Bill Date filters
    if (billDateFrom) {
      query = query.gte("bill_date", billDateFrom);
    }

    if (billDateTo) {
      query = query.lte("bill_date", billDateTo);
    }

    // 🔹 Unload Date filters
    if (unloadDateFrom) {
      query = query.gte("unload_date", unloadDateFrom);
    }

    if (unloadDateTo) {
      query = query.lte("unload_date", unloadDateTo);
    }

    // 🔹 Pagination
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;
    // console.log('@@@',data, count, page, limit);
    return {
      data,
      page,
      limit,
      total: count,
      totalPages: count ? Math.ceil(count / limit) : 0,
    };
  } catch (error) {
    throw error;
  }
};

const edit_unload_slip = async (payload: {
  p_plant_load_register_id: string;
  p_payload: any;
  p_payload_parent: any | null;
  p_user_id: string;
}) => {
  try {
    const { error } = await supabase.rpc("edit_unload_slip", payload);
    if (error) throw error;
    return true;
  } catch (error) {
    console.log((error as Error).message);
    throw error;
  }
};

const delete_unload_slip = async (plantId: string, userId: string) => {
  try {
    const { error } = await supabase.rpc("reverse_plant_unloading", {
      p_plant_load_register_id: plantId,
      p_user_id: userId,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.log((error as Error).message);
    throw error;
  }
};

export { get_All_Unload_Details, edit_unload_slip, delete_unload_slip };
