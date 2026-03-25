import Link from "next/link";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { getCategoryLabel } from "@/lib/constants";
import styles from "./NewsCard.module.css";

export interface NewsCardItem {
  _id: string;
  slug: string;
  thumbnail?: string;
  title?: { te: string };
  category?: string;
  movieRating?: number;
}

interface Props {
  item: NewsCardItem;
  variant?: "default" | "overlay";
  showCategory?: boolean;
  showRating?: boolean;
  imageRatio?: "16/9" | "16/10" | "4/3" | "3/4";
}

export default function NewsCard({
  item,
  variant = "default",
  showCategory = true,
  showRating = false,
  imageRatio = "16/9",
}: Props) {
  const href = `/${item?.category}/${item?.slug}`;

  return (
    <Link href={href} className={`${styles.card} ${styles[variant]}`}>
      <div className={styles.imageWrap} style={{ aspectRatio: imageRatio }}>
        <Image
          src={item?.thumbnail || "/images/placeholder.png"}
          alt={item?.title?.te || "news"}
          fill
          sizes="300px"
          className={styles.image}
        />
      </div>

      {variant === "overlay" && (
        <div className={styles.overlay}>
          {showCategory && item?.category && (
            <span className={styles.category}>{getCategoryLabel(item.category)}</span>
          )}
          <h3 className={styles.title}>{item?.title?.te}</h3>
        </div>
      )}

      {variant === "default" && (
        <div className={styles.content}>
          {showCategory && item?.category && (
            <span className={styles.categoryText}>{getCategoryLabel(item.category)}</span>
          )}
          {showRating && (
            <div className={styles.rating}>
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < (item?.movieRating || 0) ? styles.starActive : styles.star} />
              ))}
            </div>
          )}
          <h3 className={styles.title}>{item?.title?.te}</h3>
        </div>
      )}
    </Link>
  );
}
