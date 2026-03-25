import styles from "./VideoView.module.css";
import { Suspense } from "react";
import LatestStories from "@/components/common/lateststories/LatestStories";
import Social from "@/components/news/social/Social";
import NewsShare from "@/components/common/share/NewsShare";
import SmartAdUnit from "@/components/google-ads/SmartAdUnit";
import AdBlock from "@/components/google-ads/AdBlock";
import SuggestedVideos from "@/components/news/suggestedvideos/SuggestedVideos";
import { FaCalendarAlt } from "react-icons/fa";
import type { Video } from "@/types";

function getEmbedUrl(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
    }
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
  } catch {
    /* not a url */
  }
  return url;
}

type Props = {
  video: Video;
  related: Video[];
  suggested: Video[];
};

export default function VideoView({ video, related, suggested }: Props) {
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
      <section className={styles.left}>
        <h1 className={styles.title}>
          <span className={styles.label}>వీడియో:</span>
          {video?.title?.te}
        </h1>

        <div className={styles.metaflex}>
          <div className={styles.meta}>
            <span><FaCalendarAlt /> {formattedDate}</span>
          </div>
          <NewsShare title={video?.title?.te || "వీడియో"} />
        </div>

        <div className={styles.player}>
          <iframe
            src={getEmbedUrl(video?.videoUrl)}
            title={video?.title?.te}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <SuggestedVideos items={related} title="సంబంధిత వీడియోలు" />
        <AdBlock><SmartAdUnit slot="3315432893" /></AdBlock>
        <SuggestedVideos items={suggested} title="సూచించబడిన వీడియోలు" />
        <AdBlock><SmartAdUnit slot="9182003090" /></AdBlock>
      </section>

      <aside className={styles.right}>
        <Social />
        <AdBlock><SmartAdUnit slot="9180743912" /></AdBlock>
        <Suspense fallback={<div style={{ padding: 20 }}>తాజా కథనాలు లోడ్ అవుతున్నాయి...</div>}>
          <LatestStories />
        </Suspense>
        <AdBlock><SmartAdUnit slot="6909803795" /></AdBlock>
      </aside>
    </main>
  );
}
