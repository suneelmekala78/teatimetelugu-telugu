"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import styles from "./Videos.module.css";

const ITEMS = [
  { key: "latest", label: "తాజా వీడియోలు", img: "/images/category/v1.jpg" },
  { key: "trailers", label: "ట్రైలర్స్", img: "/images/category/v2.jpg" },
  { key: "video_songs", label: "వీడియో సాంగ్స్", img: "/images/category/v3.jpg" },
  { key: "lyrical_songs", label: "లిరికల్ సాంగ్స్", img: "/images/category/v4.jpg" },
  { key: "ott", label: "ఓటిటి", img: "/images/category/v5.jpg" },
  { key: "events", label: "ఈవెంట్స్", img: "/images/category/v6.jpg" },
  { key: "shows", label: "షోస్", img: "/images/category/v7.jpg" },
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
            <Image
              src={item.img}
              alt={item.label}
              fill
              sizes="200px"
              className={styles.tabImage}
            />

            <h3 className={`${styles.tabTitle} ${active ? styles.active : ""}`}>
              {item.label}
            </h3>
          </Link>
        );
      })}
    </div>
  );
}
