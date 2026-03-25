"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import styles from "./ScrollGrid.module.css";

interface Item {
  _id: string;
  slug: string;
  thumbnail: string;
  title: { te: string };
  category: string;
}

export default function ScrollCarousel({ items }: { items: Item[] }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection("right");
      setIndex((prev) => (prev + 1) % items.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [items.length]);

  const next = () => {
    setDirection("right");
    setIndex((prev) => (prev + 1) % items.length);
  };

  const prev = () => {
    setDirection("left");
    setIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const getClass = (i: number) => {
    if (i === index) return styles.active;
    if (direction === "right") {
      return i === (index - 1 + items.length) % items.length ? styles.leftExit : styles.rightEnter;
    }
    return i === (index + 1) % items.length ? styles.rightExit : styles.leftEnter;
  };

  return (
    <>
      <div className={styles.wrapper}>
        <button className={`${styles.btn} ${styles.left}`} onClick={prev} aria-label="Previous">
          <FaChevronLeft />
        </button>

        <div className={styles.slider}>
          {items.map((item, i) => (
            <Link
              key={item._id}
              href={`/${item.category}/${item.slug}`}
              className={`${styles.item} ${getClass(i)}`}
            >
              <Image src={item.thumbnail} alt={item.title.te} fill priority={i === 0} className={styles.image} />
              <div className={styles.title}>{item.title.te}</div>
            </Link>
          ))}
        </div>

        <button className={`${styles.btn} ${styles.right}`} onClick={next} aria-label="Next">
          <FaChevronRight />
        </button>
      </div>

      <div className={styles.dots}>
        {items.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === index ? styles.activeDot : ""}`}
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </>
  );
}
