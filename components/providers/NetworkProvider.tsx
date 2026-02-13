"use client";

import { useEffect, useState } from "react";
import NetworkError from "@/components/common/network/NetworkError";

export default function NetworkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);

    setOffline(!navigator.onLine);

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);

    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (offline) return <NetworkError />;

  return <>{children}</>;
}
