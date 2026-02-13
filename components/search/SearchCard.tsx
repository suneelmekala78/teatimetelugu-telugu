import Link from "next/link";
import Image from "next/image";
import moment from "moment";
import { FaPlay } from "react-icons/fa";

import styles from "./SearchCard.module.css";

type Props = {
  item: any;
};

export default function SearchCard({ item }: Props) {
  const route =
    item.type === "gallery"
      ? `/gallery/${item.newsId}`
      : item.type === "video"
        ? `/videos/v/${item.newsId}`
        : `/${item.category?.en || "news"}/${item.newsId}`;

  const thumb = item.type === "gallery" ? item?.galleryPics?.[0] : item.mainUrl;

  const title = item.title?.te || item.title?.en;

  return (
    <Link href={route} className={styles.card}>
      <div className={styles.imageWrap}>
        <Image src={thumb} alt={title} fill className={styles.image} />

        <span className={styles.category}>
          {item?.category?.te || item?.category?.en}
        </span>

        {item.type === "video" && (
          <div className={styles.play}>
            <FaPlay />
          </div>
        )}
      </div>

      <div className={styles.content}>
        <span className={styles.date}>
          {moment(item.createdAt).format("DD MMM YYYY")}
        </span>

        <h3 className={styles.title}>{title}</h3>
      </div>
    </Link>
  );
}
