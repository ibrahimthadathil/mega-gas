"use client";
import supabase from "@/lib/supabase/supabaseClient";
import { User } from "@supabase/supabase-js";
import React, { createContext, ReactNode, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
}
const Auth_context = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((e, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <Auth_context.Provider value={{ user }}>{children}</Auth_context.Provider>
  );
};

export  {AuthProvider,Auth_context};
