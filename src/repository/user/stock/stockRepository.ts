import supabase from "@/lib/supabase/supabaseClient";

const unload_Slip = async (payload:Record<string,unknown>) => {
  try {
    const { error } = await supabase.rpc(
      "unload_slip_insert",
      payload
    );
    if (error) throw error;
    return true
  } catch (error) {
    console.log((error as Error).message);
    throw (error as Error).message;
  }
};

export { unload_Slip };
