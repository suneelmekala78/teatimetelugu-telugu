"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { api } from "@/lib/api";
import styles from "./PopupPoster.module.css";

interface Props {
  closePopup: () => void;
}

export default function PopupPoster({ closePopup }: Props) {
  const [img, setImg] = useState("");
  const [link, setLink] = useState("");
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    api.get("/home")
      .then((res) => {
        if (res.data?.success) {
          const poster = res.data.config?.posters?.popup;
          if (poster?.image) {
            setImg(poster.image);
            setLink(poster.url || "");
          }
        }
      })
      .catch(() => {});
  }, []);

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
  }, [img]);

  useEffect(() => {
    if (img && countdown === 0) closePopup();
  }, [countdown, img, closePopup]);

  if (!img) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.frame}>
          <button className={styles.close} onClick={closePopup} aria-label="Close">
            <IoClose />
          </button>

          <div className={styles.skip}>
            యాడ్ {countdown} సెకండ్స్ లో స్కిప్ అవుతుంది
          </div>

          <a href={link} target="_blank" rel="noopener noreferrer">
            <Image src={img} alt="popup poster" width={1200} height={800} className={styles.image} priority />
          </a>
        </div>
      </div>
    </div>
  );
}
