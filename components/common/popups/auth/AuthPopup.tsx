"use client";

import styles from "./AuthPopup.module.css";
import Image from "next/image";
import { useEffect } from "react";
import { IoClose } from "react-icons/io5";

interface Props {
  open: boolean;
  onClose: () => void;
  pathname?: string;
}

export default function AuthPopup({ open, onClose, pathname }: Props) {
  /* close on ESC */
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open) return null;

  const googleUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/join-with-google?client=${process.env.NEXT_PUBLIC_CLIENT_URL}${pathname || ""}`;

  return (
    <div className={styles.overlay} onClick={onClose}>
      {/* stop closing when clicking inside */}
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        {/* close */}
        <button className={styles.close} onClick={onClose}>
          <IoClose size={22} />
        </button>

        <h2 className={styles.title}>లాగిన్</h2>

        <a href={googleUrl} className={styles.googleBtn}>
          <Image
            src="/images/google.png"
            alt="Google"
            width={20}
            height={20}
          />
          <span>Google తో కొనసాగించండి</span>
        </a>
      </div>
    </div>
  );
}
