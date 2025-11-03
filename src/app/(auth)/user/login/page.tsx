import { UserLoginForm } from "@/components/auth/login-form";
import { getAuthUserFromCookies, getUserProfile } from "@/lib/auth/jwt";
import { redirect } from "next/navigation";

export default async function UserLoginPage() {
  const { user } = await getAuthUserFromCookies();
  if (user) {
    const { profile } = await getUserProfile({} as unknown as Request, user.id);
    if (profile) {
      const path = String(profile.role).toLowerCase() === "admin" ? "/admin/dashboard" : "/user/dashboard";
      redirect(path);
    }
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <UserLoginForm />
    </main>
  );
}
