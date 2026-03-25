import styles from "./SuggestedVideos.module.css";
import Link from "next/link";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";
import SectionTitle from "@/components/common/titles/SectionTitle";
import type { Video } from "@/types";

export default function SuggestedVideos({ items = [], title = "సంబంధిత వీడియోలు" }: { items?: Video[]; title?: string }) {
  if (!items.length) return null;

  return (
    <section className={styles.wrapper}>
      <SectionTitle title={title} />

      <div className={styles.grid}>
        {items.slice(0, 6).map((video) => (
          <Link key={video._id} href={`/videos/v/${video.slug}`} className={styles.card}>
            <div className={styles.thumbWrap}>
              <Image
                src={video.thumbnail || "/images/placeholder.png"}
                alt={video.title.te}
                fill
                sizes="(max-width: 500px) 100vw, (max-width: 768px) 50vw, 33vw"
                className={styles.img}
              />
              <span className={styles.playIcon}>
                <FaPlay />
              </span>
            </div>
            <h3 className={styles.title}>{video.title.te}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
