import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABAS_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPBASE_ANON_KEY as string;
const supabase = createClient(supabaseURL, supabaseKey);

export default supabase;
