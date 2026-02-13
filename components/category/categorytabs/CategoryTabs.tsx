"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import styles from "./CategoryTabs.module.css";

type Item = {
  key: string;
  label: string;
  img: string;
};

/* ========= ALL CATEGORY CONFIG IN ONE PLACE ========= */
const CATEGORY_MAP: Record<string, Item[]> = {
  news: [
    { key: "ap", label: "ఆంధ్రప్రదేశ్", img: "/images/category/n1.jpg" },
    { key: "ts", label: "తెలంగాణ", img: "/images/category/n2.jpg" },
    { key: "national", label: "జాతీయ", img: "/images/category/n3.jpg" },
    {
      key: "international",
      label: "అంతర్జాతీయ",
      img: "/images/category/n4.png",
    },
  ],

  politics: [
    { key: "ap", label: "ఆంధ్రప్రదేశ్", img: "/images/category/p1.jpg" },
    { key: "ts", label: "తెలంగాణ", img: "/images/category/p2.webp" },
    { key: "national", label: "జాతీయ", img: "/images/category/p3.webp" },
    {
      key: "international",
      label: "అంతర్జాతీయ",
      img: "/images/category/p4.jpeg",
    },
  ],

  movies: [
    { key: "tollywood", label: "టాలీవుడ్", img: "/images/category/m1.webp" },
    { key: "bollywood", label: "బాలీవుడ్", img: "/images/category/m2.jpg" },
    { key: "hollywood", label: "హాలీవుడ్", img: "/images/category/m3.jpeg" },
    { key: "south", label: "సౌత్", img: "/images/category/m4.png" },
    { key: "collections", label: "కలెక్షన్స్", img: "/images/category/m5.jpg" },
  ],

  gossips: [
    { key: "ap-political", label: "ఆంధ్రప్రదేశ్", img: "/images/category/p1.jpg" },
    { key: "ts-political", label: "తెలంగాణ", img: "/images/category/p2.webp" },
    { key: "movies", label: "సినిమాలు", img: "/images/category/m1.webp" },
  ],

  reviews: [
    { key: "theater", label: "థియేటర్", img: "/images/category/m5.jpg" },
    { key: "ott", label: "ఓటీటీ", img: "/images/category/r2.jpg" },
  ],

  ott: [
    { key: "reviews", label: "రివ్యూస్", img: "/images/category/o1.webp" },
    { key: "release", label: "రిలీజ్‌లు", img: "/images/category/o2.webp" },
  ],

  sports: [
    { key: "cricket", label: "క్రికెట్", img: "/images/category/s2.webp" },
    { key: "football", label: "ఫుట్‌బాల్", img: "/images/category/s1.avif" },
    { key: "kabaddi", label: "కబడ్డి", img: "/images/category/s3.jpg" },
    { key: "olympics", label: "ఒలింపిక్స్", img: "/images/category/s4.jpg" },
  ],

  business: [
    { key: "national", label: "జాతీయ", img: "/images/category/b1.jpg" },
    { key: "international", label: "అంతర్జాతీయ", img: "/images/category/b2.png" },
  ],

  technology: [
    { key: "ai", label: "ఏఐ", img: "/images/category/t1.jpg" },
    { key: "cyber_crime", label: "సైబర్", img: "/images/category/t2.webp" },
    { key: "national", label: "జాతీయ", img: "/images/category/t3.jpg" },
    { key: "international", label: "అంతర్జాతీయ", img: "/images/category/t4.jpg" },
  ],

  health: [
    { key: "nutrition", label: "ఫిట్నెస్", img: "/images/category/h1.jpg" },
    { key: "mental", label: "మానసిక", img: "/images/category/h2.jpg" },
    { key: "physical", label: "శారీరక", img: "/images/category/h3.jpg" },
  ]
};

/* ================================================= */

export default function CategoryTabs() {
  const params = useParams();
  const searchParams = useSearchParams();

  const category = params.category as string;
  const subcategory = searchParams.get("subcategory") || "";

  const items = CATEGORY_MAP[category] || [];

  if (!items.length) return null;

  return (
    <div className={styles.container}>
      {items.map((item) => {
        const active = subcategory === item.key;

        return (
          <Link
            key={item.key}
            href={`/c/${category}?subcategory=${item.key}`}
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
