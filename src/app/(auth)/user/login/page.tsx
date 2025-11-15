import { UserLoginForm } from "@/components/auth/login-form";
import { getAuthenticatedProfile, normalizeRole } from "@/lib/auth/jwt";
import { redirect } from "next/navigation";

const ADMIN_ROLES = new Set(["admin", "manager", "accountant"]);

export default async function UserLoginPage() {
  const { profile } = await getAuthenticatedProfile();

  if (profile) {
    const role = normalizeRole(profile.role);
    const path = ADMIN_ROLES.has(role) ? "/admin/dashboard" : "/user/dashboard";
    redirect(path);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <UserLoginForm />
    </main>
  );
}
