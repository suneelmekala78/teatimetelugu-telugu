"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import PopupPoster from "@/components/common/popups/poster/PopupPoster";

export default function ClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  useEffect(() => {
    const lastShown = localStorage.getItem("ttt-te-popupLastShown");
    const now = Date.now();

    /* show popup once every 10 minutes */
    if (!lastShown || now - Number(lastShown) > 10 * 60 * 1000) {
      setShowPopup(true);
    }
  }, []);

  const closePopup = () => {
    localStorage.setItem("ttt-te-popupLastShown", Date.now().toString());
    setShowPopup(false);
  };

  return (
    <>
      {children}
      {showPopup && <PopupPoster closePopup={closePopup} />}
    </>
  );
}
