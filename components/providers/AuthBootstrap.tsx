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
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    api
      .get("/auth/me")
      .then((res) => {
        if (res.data?.success && res.data.user) {
          login(res.data.user);
        } else {
          logout();
        }
      })
      .catch(() => logout());
  }, [login, logout]);

  return children;
}
