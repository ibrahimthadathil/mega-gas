import { Auth_context } from "@/context/authProvider";
import { useContext } from "react";

const useAuth = () => {
  const context = useContext(Auth_context);
  if(!Auth_context) throw new Error("useAuth use inside the ")
  return context;
};

export default useAuth;
