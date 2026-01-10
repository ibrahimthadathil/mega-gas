import supabaseAdmin from "@/lib/supabase/supabaseAdmin";

const daily_Report_View = async (
  { page = 1, limit = 7 }: { page?: number; limit?: number } = {}
) => {
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

export { daily_Report_View };
