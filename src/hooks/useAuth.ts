import { Auth_context } from "@/context/authProvider";
import { useContext } from "react";

const useAuth = () => {
  const context = useContext(Auth_context);
  if(!context) throw new Error("useAuth must be used inside AuthProvider")
  return context;
};

export default useAuth;
