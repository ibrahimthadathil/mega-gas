import supabase from "@/lib/supabase/supabaseClient";
import { Expense } from "@/types/types";

const add_Expense = async (datas: Expense) => {
  const { type, amount, created_by, image } = datas;
  try {
    const { data, error } = await supabase
      .from("expenses")
      .insert([
        {
          created_by,
          expenses_type: type,
          photo: image,
          description: "test expenses",
        },
      ])
      .select();
    if (error) throw error;
    else return { data, success: true };
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

const getAllExpenses = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("created_by", userId)
      .order("created_time", { ascending: false });
      if(error) throw error 
      else return {data , success:true}
  } catch (error) {
    throw error;
  }
};

export { add_Expense, getAllExpenses };
