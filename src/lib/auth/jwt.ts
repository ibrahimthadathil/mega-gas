import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { Session } from "@supabase/supabase-js";

import supabaseAdmin from "@/lib/supabase/supabaseAdmin";
import { normalizeRole as edgeNormalizeRole } from "./edgeAuth";

type AuthUserResult = {
  user: { id: string; email?: string | null } | null;
  error?: string | null;
};

export type UserProfile = {
  id: string;
  auth_id: string;
  user_name: string;
  email: string;
  role: string;
  phone?: string | null;
};

// Re-export normalizeRole from edgeAuth for backward compatibility
export const normalizeRole = edgeNormalizeRole;

export async function getAuthUser(): Promise<AuthUserResult> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) return { user: null, error: "NO_TOKEN" };

    const { data, error } = await supabaseAdmin.auth.getUser(accessToken);
    if (error || !data?.user) return { user: null, error: error?.message ?? "INVALID_TOKEN" };

    return { user: { id: data.user.id, email: data.user.email }, error: null };
  } catch (e: unknown) {
    return { user: null, error: (e as Error)?.message ?? "UNKNOWN_ERROR" };
  }
}

export async function getUserProfile(
  _req: NextRequest | null,
  authId: string
): Promise<{ profile: UserProfile | null; error?: string | null }> {
  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("auth_id", authId)
      .single();

    if (error || !data) return { profile: null, error: error?.message ?? "PROFILE_NOT_FOUND" };
    return { profile: data as UserProfile, error: null };
  } catch (e: unknown) {
    return { profile: null, error: (e as Error)?.message ?? "UNKNOWN_ERROR" };
  }
}

export async function refreshAccessToken(
  refreshToken?: string
): Promise<{ session: Session | null; error?: string | null }> {
  try {
    let token = refreshToken;
    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get("refresh_token")?.value;
    }

    if (!token) return { session: null, error: "NO_REFRESH_TOKEN" };

    const { data, error } = await supabaseAdmin.auth.refreshSession({
      refresh_token: token,
    });

    if (error || !data?.session) {
      return { session: null, error: error?.message ?? "REFRESH_FAILED" };
    }

    return { session: data.session, error: null };
  } catch (e: unknown) {
    return { session: null, error: (e as Error)?.message ?? "UNKNOWN_ERROR" };
  }
}

export async function getAuthenticatedProfile(req?: NextRequest | null) {
  const { user, error } = await getAuthUser();
  if (error || !user) {
    return { user: null, profile: null, error };
  }

  const { profile, error: profileError } = await getUserProfile(req ?? null, user.id);
  return { user, profile, error: profileError ?? null };
}

export async function getAuthUserFromCookies(): Promise<AuthUserResult> {
  return getAuthUser();
}


