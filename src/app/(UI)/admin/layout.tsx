  "use client";
  import {
    isAdmin,
    selectIsAuthenticated,
  } from "@/redux/store/selectors/authSelectors";
  import { redirect } from "next/navigation";
  import React, { ReactNode, useEffect } from "react";
  import { useSelector } from "react-redux";
  import { toast } from "sonner";

  const Layout = ({ children }: { children: ReactNode }) => {
    const is_admin = useSelector(isAdmin);
    const is_authenticated = useSelector(selectIsAuthenticated);

    useEffect(() => {
      if (!is_admin || !is_authenticated) {
        toast.warning("Access Denied");
        redirect("/");
      }
    }, [is_admin,is_authenticated]);
    return <>{children}</>;
  };

  export default Layout;
