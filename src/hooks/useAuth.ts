import supabase from "@/lib/supabase/supabaseClient";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slice/auth/authSlicer";
import { toast } from "sonner";
export const useAuth = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const Logout = async () => {
    try {
      await supabase.auth.signOut();
      await axios.post("/api/user/auth/logout");
      dispatch(logout());
      router.replace("/user/login");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  return { Logout };
};
