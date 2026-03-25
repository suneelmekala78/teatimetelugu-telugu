"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import styles from "./Videos.module.css";

const ITEMS = [
  { key: "trailers-teasers", label: "ట్రైలర్లు & టీజర్లు", img: "/images/category/v2.jpg" },
  { key: "video-songs", label: "వీడియో సాంగ్స్", img: "/images/category/v3.jpg" },
  { key: "lyrical-songs", label: "లిరికల్ సాంగ్స్", img: "/images/category/v4.jpg" },
  { key: "ott", label: "ఓటిటి", img: "/images/category/v5.jpg" },
  { key: "events", label: "ఈవెంట్స్", img: "/images/category/v6.jpg" },
  { key: "shows", label: "షోస్", img: "/images/category/v7.jpg" },
  { key: "reviews-public-talks", label: "రివ్యూలు & పబ్లిక్ టాక్", img: "/images/category/v1.jpg" },
];

export default function VideosTabs() {
  const searchParams = useSearchParams();
  const subcategory = searchParams.get("subcategory") || "";

  return (
    <div className={styles.tabs}>
      {ITEMS.map((item) => {
        const active = subcategory === item.key;
        return (
          <Link
            key={item.key}
            href={`/videos?subcategory=${item.key}`}
            className={styles.tabCard}
          >
            <Image src={item.img} alt={item.label} fill sizes="200px" className={styles.tabImage} />
            <h3 className={`${styles.tabTitle} ${active ? styles.active : ""}`}>{item.label}</h3>
          </Link>
        );
      })}
    </div>
  );
}
