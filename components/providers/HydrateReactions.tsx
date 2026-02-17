"use client";

import { useEffect, useRef } from "react";
import { useUserStore, Reaction } from "@/store/useUserStore";

export default function HydrateReactions({
  reactions,
  children,
}: {
  reactions: Reaction[];
  children: React.ReactNode;
}) {
  const setReactions = useUserStore((s) => s.setReactions);

  useEffect(() => {
    setReactions(reactions); 
  }, [reactions, setReactions]);

  return children;
}
