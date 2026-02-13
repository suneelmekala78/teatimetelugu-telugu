import Link from "next/link";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import styles from "./NewsCard.module.css";

/* ================= TYPES ================= */

export interface NewsCardItem {
  _id: string;
  newsId: string;
  mainUrl?: string;
  title?: { te: string };
  category?: { te?: string; en?: string };
  movieRating?: number;
}

/* ================= PROPS ================= */

interface Props {
  item: NewsCardItem;

  variant?: "default" | "overlay"; // gallery uses overlay
  showCategory?: boolean;
  showRating?: boolean;
  imageRatio?: "16/9" | "16/10" | "4/3" | "3/4";
}

/* ================= COMPONENT ================= */

export default function NewsCard({
  item,
  variant = "default",
  showCategory = true,
  showRating = false,
  imageRatio = "16/9",
}: Props) {
  const href = `/${item?.category?.en}/${item?.newsId}`;

  return (
    <Link href={href} className={`${styles.card} ${styles[variant]}`}>
      {/* IMAGE */}
      <div
        className={styles.imageWrap}
        style={{ aspectRatio: imageRatio }}
      >
        <Image
          src={item?.mainUrl || "/placeholder.webp"}
          alt={item?.title?.te || "news"}
          fill
          sizes="300px"
          className={styles.image}
        />
      </div>

      {/* OVERLAY MODE (Gallery style) */}
      {variant === "overlay" && (
        <div className={styles.overlay}>
          {showCategory && (
            <span className={styles.category}>
              {item?.category?.te}
            </span>
          )}

          <h3 className={styles.title}>{item?.title?.te}</h3>
        </div>
      )}

      {/* DEFAULT MODE */}
      {variant === "default" && (
        <div className={styles.content}>
          {showCategory && (
            <span className={styles.categoryText}>
              {item?.category?.te}
            </span>
          )}

          {showRating && (
            <div className={styles.rating}>
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={
                    i < (item?.movieRating || 0)
                      ? styles.starActive
                      : styles.star
                  }
                />
              ))}
            </div>
          )}

          <h3 className={styles.title}>{item?.title?.te}</h3>
        </div>
      )}
    </Link>
  );
}
