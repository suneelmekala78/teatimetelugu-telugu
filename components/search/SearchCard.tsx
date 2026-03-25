import Link from "next/link";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";
import { formatDate } from "@/lib/constants";
import styles from "./SearchCard.module.css";

interface SearchHit {
  _id?: string;
  slug?: string;
  type?: string;
  category?: string;
  thumbnail?: string;
  images?: string[];
  title?: { te?: string; en?: string };
  title_te?: string;
  title_en?: string;
  createdAt?: string;
  publishedAt?: string | number;
}

type Props = {
  item: SearchHit;
};

export default function SearchCard({ item }: Props) {
  const route =
    item.type === "gallery"
      ? `/gallery/${item.slug}`
      : item.type === "video"
        ? `/videos/v/${item.slug}`
        : `/${item.category || "general"}/${item.slug}`;

  const thumb =
    item.type === "gallery"
      ? item.images?.[0] || item.thumbnail
      : item.thumbnail;

  const title = item.title?.te || item.title?.en || item.title_te || item.title_en || "";

  const date = item.createdAt || item.publishedAt;

  return (
    <Link href={route} className={styles.card}>
      <div className={styles.imageWrap}>
        {thumb && (
          <Image src={thumb} alt={title} fill className={styles.image} />
        )}

        {item.category && (
          <span className={styles.category}>{item.category}</span>
        )}

        {item.type === "video" && (
          <div className={styles.play}><FaPlay /></div>
        )}
      </div>

      <div className={styles.content}>
        {date && (
          <span className={styles.date}>{formatDate(typeof date === "number" ? new Date(date).toISOString() : date)}</span>
        )}
        <h3 className={styles.title}>{title}</h3>
      </div>
    </Link>
  );
}
