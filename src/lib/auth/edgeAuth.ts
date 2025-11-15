import supabaseAdmin from "@/lib/supabase/supabaseAdmin";

export type UserProfile = {
  id: string;
  auth_id: string;
  user_name: string;
  email: string;
  role: string;
  phone?: string | null;
};

/**
 * Normalizes a role string to a consistent format.
 * Edge-safe pure function.
 */
export function normalizeRole(role?: string | null): string {
  return role ? role.toString().trim().toLowerCase().replace(/[\s-]+/g, "_") : "";
}

/**
 * Gets user profile by auth ID.
 * Edge-safe function that doesn't use cookies() or NextRequest.
 */
export async function getUserProfileByAuthId(
  authId: string
): Promise<{ profile: UserProfile | null; error?: string | null }> {
  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("auth_id", authId)
      .single();

    if (error || !data) {
      return { profile: null, error: error?.message ?? "PROFILE_NOT_FOUND" };
    }
    return { profile: data as UserProfile, error: null };
  } catch (e: unknown) {
    return { profile: null, error: (e as Error)?.message ?? "UNKNOWN_ERROR" };
  }
}

