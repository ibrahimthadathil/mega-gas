import { createClient } from "@supabase/supabase-js";

/**
 * Create a Supabase client for middleware that uses the provided access token
 * This client is used to verify JWT tokens in middleware
 */
export function createMiddlewareClient(accessToken: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABAS_URL!,
    process.env.NEXT_PUBLIC_SUPBASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );
}

