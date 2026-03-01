"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { toast } from "sonner";

import styles from "./PopupPoster.module.css";
import { getPopupPoster } from "@/lib/requests-server";

interface Props {
  closePopup: () => void;
}

export default function PopupPoster({ closePopup }: Props) {
  const [img, setImg] = useState("");
  const [link, setLink] = useState("");
  const [countdown, setCountdown] = useState(10);

  /* -------- Fetch Poster -------- */
  useEffect(() => {
    const fetchPoster = async () => {
      try {
        const res = await getPopupPoster();

        if (res?.status === "success") {
          setImg(res.popupPoster?.img || "");
          setLink(res.popupPoster?.link || "");
        } 
      } catch {
        toast.error("Failed to load popup");
      }
    };

    fetchPoster();
  }, []);

  /* -------- Countdown -------- */
  useEffect(() => {
    if (!img) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [img, closePopup]);

  useEffect(() => {
    if (!img) return;
    if (countdown === 0) {
      closePopup();
    }
  }, [countdown, img, closePopup]);

  if (!img) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.frame}>
          {/* Close */}
          <button className={styles.close} onClick={closePopup}>
            <IoClose />
          </button>

          {/* Skip */}
          <div className={styles.skip}>
            యాడ్ {countdown} సెకండ్స్ లో స్కిప్ అవుతుంది
          </div>

          {/* Image */}
          <a href={link} target="_blank" rel="noopener noreferrer">
            <Image
              src={img}
              alt="popup poster"
              width={1200}
              height={800}
              className={styles.image}
              priority
            />
          </a>
        </div>
      </div>
    </div>
  );
}
