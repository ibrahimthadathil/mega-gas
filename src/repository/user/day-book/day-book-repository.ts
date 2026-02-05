import supabase from "@/lib/supabase/supabaseClient";

interface DayBookFilters {
  date?: string;
  chest?: string;
  status?: string;
}

const get_Day_Book = async (filters?: DayBookFilters) => {
  try {
    // Start building the query
    let query = supabase.from("sales_slip_merged_summary2").select("*");

    // Apply filters if provided
    if (filters) {
      // Date filter - filter by transaction_date
      if (filters.date) {
        // Match exact date (ignoring time)
        query = query
          .gte("transaction_date", `${filters.date}T00:00:00`)
          .lt("transaction_date", `${filters.date}T23:59:59`);
      }

      // Chest filter
      if (filters.chest) {
        query = query.eq("chest_name", filters.chest);
      }

      // Status filter
      if (filters.status) {
        query = query.eq("status", filters.status);
      }
    }

    // Order by transaction_date descending (newest first)
    // query = query.order('transaction_date', { ascending: false });
    // Order by transaction_date first (ascending), then by id
    query = query
      .order("transaction_date", { ascending: true })
      .order("id", { ascending: true });

    const { data, error } = await query;

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.log((error as Error).message);
    throw error;
  }
};

const add_cash_adjustment = async (payload: any) => {
  try {
    const {error} = await supabase.from("cash_chest").insert(payload);
    if(error) throw error
    return true
  } catch (error) {
    throw error;
  }
};

export { get_Day_Book, add_cash_adjustment };
