import styles from "./VideoView.module.css";
import LatestStories from "@/components/common/lateststories/LatestStories";
import SectionTitle from "@/components/common/titles/SectionTitle";
import Social from "@/components/news/social/Social";
import Link from "next/link";
import { FaCalendarAlt } from "react-icons/fa";

type Props = {
  video: any;
  suggested: any[];
  similar: any[];
};

export default function VideoView({ video, suggested, similar }: Props) {
  const date = new Date(video.createdAt);

  const time = new Intl.DateTimeFormat("te-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  const dayDate = new Intl.DateTimeFormat("te-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  const formattedDate = `${time.toUpperCase()}, ${dayDate}`;

  return (
    <main className={styles.wrapper}>
      {/* ===== LEFT ===== */}
      <section className={styles.left}>
        <h1 className={styles.title}>
          <span className={styles.label}>వీడియో:</span>
          {video?.title?.te}
        </h1>

        <p className={styles.date}><FaCalendarAlt /> {formattedDate}</p>

        {/* VIDEO */}
        <div className={styles.player}>
          <iframe
            src={video?.videoUrl}
            title={video?.title?.te}
            allowFullScreen
          />
        </div>

        {/* RELATED */}
        {similar.length > 0 && (
          <div className={styles.related}>
            <SectionTitle title="సంబంధిత వీడియోలు" />

            <div className={styles.relatedGrid}>
              {similar.map((item: any) => (
                <Link
                  key={item._id}
                  href={`/videos/v/${item.newsId}`}
                  className={styles.card}
                >
                  <img src={item.mainUrl} alt="" />
                  <h4>{item.title?.te}</h4>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* SUGGESTED */}
        {suggested.length > 0 && (
          <div className={styles.suggested}>
            <SectionTitle title="సిఫార్సు చేసిన వీడియోలు" />

            <div className={styles.suggestedGrid}>
              {suggested.map((item: any) => (
                <Link
                  key={item._id}
                  href={`/videos/v/${item.newsId}`}
                  className={styles.suggestedCard}
                >
                  <img src={item.mainUrl} alt="" />
                  <h4>{item.title?.te}</h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ===== RIGHT SIDEBAR ===== */}
      <aside className={styles.right}>
        <Social />
        <LatestStories />
      </aside>
    </main>
  );
}
