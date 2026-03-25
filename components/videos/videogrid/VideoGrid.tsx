import Link from "next/link";
import Image from "next/image";
import styles from "./VideoGrid.module.css";
import { getVideosBySubCategory } from "@/lib/requests-server";
import SectionTitle from "@/components/common/titles/SectionTitle";
import type { Video } from "@/types";

interface Props {
  category: string;
  limit?: number;
  title?: string;
  nav?: string;
}

export default async function VideoGrid({
  category,
  limit = 8,
  title,
  nav,
}: Props) {
  let videos: Video[] = [];

  try {
    const res = await getVideosBySubCategory(category, { page: 1, limit });
    if (res?.success) {
      videos = res.videos || [];
    }
  } catch {}

  if (!videos.length) return null;

  return (
    <section className={styles.section}>
      <SectionTitle title={title || "వీడియోలు"} nav={nav || ""} />
      <div className={styles.grid}>
        {videos.map((video) => (
          <Link
            key={video._id}
            href={`/videos/v/${video.slug}`}
            className={styles.card}
            aria-label={video.title?.te}
          >
            <div className={styles.thumb}>
              <Image
                src={video.thumbnail}
                alt={video.title?.te}
                fill
                sizes="(max-width:768px) 50vw, 25vw"
                className={styles.image}
              />
              <div className={styles.play}>▶</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
