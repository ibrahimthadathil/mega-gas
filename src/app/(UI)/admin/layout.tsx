  "use client";
  import {
    isAdmin,
    selectIsAuthenticated,
  } from "@/redux/store/selectors/authSelectors";
  import { redirect } from "next/navigation";
  import React, { ReactNode, useEffect } from "react";
  import { useSelector } from "react-redux";

  const Layout = ({ children }: { children: ReactNode }) => {
    const is_admin = useSelector(isAdmin);
    const is_authenticated = useSelector(selectIsAuthenticated);

    useEffect(() => {
      if (!is_admin || !is_authenticated) {
        redirect("/user/login");
      }
    }, [is_admin,is_authenticated]);
    return <>{children}</>;
  };

  export default Layout;
