import { cookies } from "next/headers";
import supabaseAdmin from "@/lib/supabase/supabaseAdmin";

type AuthUserResult = {
  user: { id: string; email?: string | null } | null;
  error?: string | null;
};

type UserProfile = {
  id: string;
  auth_id: string;
  user_name: string;
  email: string;
  role: string;
  phone?: string | null;
};

export async function getAuthUser(_req: Request): Promise<AuthUserResult> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) return { user: null, error: "NO_TOKEN" };

    const { data, error } = await supabaseAdmin.auth.getUser(accessToken);
    if (error || !data?.user) return { user: null, error: error?.message ?? "INVALID_TOKEN" };

    return { user: { id: data.user.id, email: data.user.email }, error: null };
  } catch (e: any) {
    return { user: null, error: e?.message ?? "UNKNOWN_ERROR" };
  }
}

export async function getUserProfile(_req: Request, authId: string): Promise<{ profile: UserProfile | null; error?: string | null }> {
  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("auth_id", authId)
      .single();

    if (error || !data) return { profile: null, error: error?.message ?? "PROFILE_NOT_FOUND" };
    return { profile: data as UserProfile, error: null };
  } catch (e: any) {
    return { profile: null, error: e?.message ?? "UNKNOWN_ERROR" };
  }
}

export async function getAuthUserFromCookies(): Promise<AuthUserResult> {
  return getAuthUser({} as unknown as Request);
}


