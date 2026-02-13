"use client";

import { FaWifi, FaRedo } from "react-icons/fa";
import styles from "./NetworkError.module.css";

export default function NetworkError() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <FaWifi className={styles.icon} />

        <h2>ఇంటర్నెట్ కనెక్షన్ లేదు</h2>

        <p>
          దయచేసి మీ నెట్‌వర్క్ చెక్ చేసి మళ్లీ ప్రయత్నించండి.
        </p>

        <button onClick={() => location.reload()} className={styles.btn}>
          <FaRedo /> మళ్లీ ప్రయత్నించండి
        </button>
      </div>
    </div>
  );
}
