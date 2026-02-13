import Link from "next/link";
import Image from "next/image";
import styles from "./VideoGrid.module.css";
import { getFilteredVideos } from "@/lib/requests";
import SectionTitle from "@/components/common/titles/SectionTitle";

interface Props {
  category: string; // trailers | lyrical_songs | events etc
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
  let videos: any[] = [];

  try {
    const res = await getFilteredVideos({
      category,
      page: 1,
      limit,
    });

    if (res?.status === "success") {
      videos = res.videos || [];
    }
  } catch {
    videos = [];
  }

  if (!videos.length) return null;

  return (
    <section className={styles.section}>
      <SectionTitle title={title || "వీడియోలు"} nav={nav || ""} />
      <div className={styles.grid}>
        {videos.map((video) => (
          <Link
            key={video._id}
            href={`/videos/v/${video.newsId}`}
            className={styles.card}
            aria-label={video.title?.te}
          >
            <div className={styles.thumb}>
              <Image
                src={video.mainUrl}
                alt={video.title?.te}
                fill
                sizes="(max-width:768px) 50vw, 25vw"
                className={styles.image}
              />

              {/* play overlay */}
              <div className={styles.play}>▶</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
