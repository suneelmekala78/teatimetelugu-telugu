"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import styles from "./GalleryTabs.module.css";

const ITEMS = [
  {
    key: "actress",
    label: "హీరోయిన్",
    img: "/images/category/g1.jpg",
  },
  {
    key: "hero",
    label: "హీరో",
    img: "/images/category/g2.jpg",
  },
  {
    key: "celebrity",
    label: "సెలబ్రిటీ",
    img: "/images/category/g3.jpg",
  },
];

export default function GalleryTabs() {
  const searchParams = useSearchParams();
  const subcategory = searchParams.get("subcategory") || "";

  return (
    <div className={styles.container}>
      {ITEMS.map((item) => {
        const active = subcategory === item.key;

        return (
          <Link
            key={item.key}
            href={`/gallery?subcategory=${item.key}`}
            className={styles.card}
          >
            <Image
              src={item.img}
              alt={item.label}
              fill
              sizes="200px"
              className={styles.image}
            />

            <h3 className={`${styles.title} ${active ? styles.active : ""}`}>
              {item.label}
            </h3>
          </Link>
        );
      })}
    </div>
  );
}
