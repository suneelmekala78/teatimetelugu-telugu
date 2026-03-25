"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import type { User } from "@/types";

export default function HydrateUser({
  user,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) {
  const login = useUserStore((s) => s.login);
  const logout = useUserStore((s) => s.logout);

  useEffect(() => {
    if (user) login(user);
    else logout();
  }, [user, login, logout]);

  return children;
}
