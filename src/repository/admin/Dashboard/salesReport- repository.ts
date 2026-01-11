import supabaseAdmin from "@/lib/supabase/supabaseAdmin";
import { DeliveryPayload } from "@/types/deliverySlip";

const daily_Report_View = async ({
  page = 1,
  limit = 7,
}: { page?: number; limit?: number } = {}) => {
  const offset = (page - 1) * limit;
  try {
    const { data, error } = await supabaseAdmin
      .from("daily_sales_report_view")
      .select("*", { count: "exact" })
      .range(offset, offset + limit - 1);
    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
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

const edit_sales_slip = async (payload:DeliveryPayload,userId:string,slipId:string) => {
  try {
    const { error } = await supabaseAdmin.rpc("update_sales_slip_safe", {
      p_sales_slip_id: slipId,
      payload: payload,
      p_updated_by: userId,
    });
    if(error) throw error
    return true
  } catch (error) {
    console.log((error as Error).message);

    throw error;
  }
};

const get_Sales_Slip_ById = async (slipId: string) => {
  try {
    const { data,error } = await supabaseAdmin.rpc(
      "get_sales_slip_full_report",
      {
        p_sales_slip_id: slipId,
      }
    );

    if (error) throw error;
    console.log(data);
    
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
