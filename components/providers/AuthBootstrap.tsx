"use client";

import { useEffect } from "react";
import { api } from "@/lib/api";
import { useUserStore } from "@/store/useUserStore";

export default function AuthBootstrap({
  children,
}: {
  children: React.ReactNode;
}) {
  const login = useUserStore((s) => s.login);
  const logout = useUserStore((s) => s.logout);

  useEffect(() => {
    api({ url: "/user/me" })
      .then((res: any) => {
        if (res?.user) login(res.user);
        else logout();
      })
      .catch(() => logout());
  }, [login, logout]);

  return children;
}
