"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import type { User } from "@/types";

export default function UserHydrator({
  user,
}: {
  user: User | null;
}) {
  const login = useUserStore((s) => s.login);

  useEffect(() => {
    if (user) login(user);
  }, [user, login]);

  return null;
}
