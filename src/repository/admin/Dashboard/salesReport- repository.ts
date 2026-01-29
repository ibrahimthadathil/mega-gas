import supabaseAdmin from "@/lib/supabase/supabaseAdmin";
import { FilterParams } from "@/types/admin/salesReportView";



const daily_Report_View = async ({
  startDate,
  endDate,
  status,
  warehouse,
  chest,
  page = 1,
  limit = 16,
}: FilterParams = {}) => {
  const offset = (page - 1) * limit;

  try {
    // Start building the query
    let query = supabaseAdmin
      .from("daily_sales_report_view")
      .select("*", { count: "exact" });

    // Apply date filters
    if (startDate && endDate) {
      // If both dates are the same, filter for that specific date
      if (startDate === endDate) {
        query = query.eq("date", startDate);
      } else {
        // Otherwise, filter for the date range
        query = query.gte("date", startDate).lte("date", endDate);
      }
    } else if (startDate) {
      // Only start date provided
      query = query.gte("date", startDate);
    } else if (endDate) {
      // Only end date provided
      query = query.lte("date", endDate);
    }

    // Apply status filter (case-insensitive)
    if (status) {
      query = query.ilike("status", status);
    }
    if(chest) query = query.eq("chest_name", chest);
    // Apply warehouse filter (chest_name column)
    if (warehouse) {
      query = query.eq("warehouse_name", warehouse);
    }

    // Order by date descending (most recent first)
    query = query.order("date", { ascending: false });

    // Apply pagination if needed
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      success: true,
      data,
      count,
      message: "Sales reports retrieved successfully",
    };
  } catch (error) {
    console.error("Error fetching sales reports:", error);
    return {
      success: false,
      data: null,
      message: (error as Error).message,
    };
  }
};




const delete_sales = async (slipId: string, userId: string) => {
  try {
    const { error } = await supabaseAdmin.rpc("delete_sales_slip", {
      p_sales_slip_id: slipId,
      p_deleted_by: userId,
    });
    if (error) throw error;
    return true;
  } catch (error) {
    console.log((error as Error).message);
  }
};

const edit_sales_slip = async (
  payload: any,
  remark: string,
  p_round_off: number,
  userId: string,
  slipId: string
) => {
  try {
    const { error } = await supabaseAdmin.rpc("replace_sales_slip_atomic", {
      p_sales_slip_id: slipId,
      payload: payload,
      p_user_id: userId,
      p_remark: remark,
      p_round_off,
    });
    if (error) throw error;
    return true;
  } catch (error) {
    console.log((error as Error).message);

    throw error;
  }
};

const get_Sales_Slip_ById = async (slipId: string) => {
  try {
    const { data, error } = await supabaseAdmin.rpc(
      "get_sales_slip_full_report",
      {
        p_sales_slip_id: slipId,
      }
    );

    if (error) throw error;
    console.log(JSON.stringify(data,null,2));
    
    return data;
  } catch (error) {
    console.log((error as Error).message);
  }
};
export {
  daily_Report_View,
  delete_sales,
  edit_sales_slip,
  get_Sales_Slip_ById,
};
