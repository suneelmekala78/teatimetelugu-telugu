"use client";

import styles from "./AuthPopup.module.css";
import Image from "next/image";
import { useEffect, useMemo, useCallback, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "sonner";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useUserStore } from "@/store/useUserStore";

interface Props {
  open: boolean;
  onClose: () => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (element: HTMLElement, config: Record<string, unknown>) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function AuthPopup({ open, onClose }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useUserStore();
  const buttonRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  const handleCredentialResponse = useCallback(
    async (response: { credential: string }) => {
      try {
        const res = await api.post("/auth/google", {
          idToken: response.credential,
        });

        if (res.data?.success) {
          const { accessToken, user } = res.data;
          login(user, accessToken);
          toast.success("విజయవంతంగా లాగిన్ అయ్యారు!");
          onClose();
          router.refresh();
        } else {
          toast.error(res.data?.message || "లాగిన్ విఫలమైంది");
        }
      } catch {
        toast.error("లాగిన్ విఫలమైంది. మళ్ళీ ప్రయత్నించండి.");
      }
    },
    [login, onClose, router]
  );

  useEffect(() => {
    if (!open) return;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set");
      return;
    }

    const initializeGoogle = () => {
      if (!window.google || !buttonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        width: 300,
        text: "continue_with",
        locale: "te",
      });
    };

    if (window.google) {
      initializeGoogle();
      return;
    }

    if (!scriptLoaded.current) {
      scriptLoaded.current = true;
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.head.appendChild(script);
    }
  }, [open, handleCredentialResponse]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>
          <IoClose size={22} />
        </button>

        <h2 className={styles.title}>లాగిన్</h2>

        <div ref={buttonRef} className={styles.googleBtn} />
      </div>
    </div>
  );
}
