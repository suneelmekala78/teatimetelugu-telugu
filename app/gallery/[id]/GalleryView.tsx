import Image from "next/image";
import { Suspense } from "react";
import styles from "./GalleryView.module.css";
import LatestStories from "@/components/common/lateststories/LatestStories";
import Social from "@/components/news/social/Social";
import GalleryPopup from "./GalleryPopup";
import Reactions from "@/components/news/reactions/Reactions";
import { FaCalendarAlt } from "react-icons/fa";
import CommentsServer from "@/components/news/comments/CommentsServer";
import ReadButton from "@/components/news/readbutton/ReadButton";
import NewsShare from "@/components/common/share/NewsShare";
import SuggestedGallery from "@/components/news/suggestedgallery/SuggestedGallery";
import SmartAdUnit from "@/components/google-ads/SmartAdUnit";
import AdBlock from "@/components/google-ads/AdBlock";
import type { Gallery } from "@/types";

type Props = {
  gallery: Gallery;
  suggested: Gallery[];
};

export default function GalleryView({ gallery, suggested }: Props) {
  const date = new Date(gallery.createdAt);

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
      <div className={styles.left}>
        <h1 className={styles.title}>{gallery?.title?.te}</h1>

        <div className={styles.metaflex}>
          <div className={styles.meta}>
            <span><FaCalendarAlt /> {formattedDate}</span>
            {gallery?.audio?.te && <ReadButton news={gallery} />}
          </div>
          <NewsShare title={gallery?.title?.te} />
        </div>

        {gallery.images?.[0] && (
          <Image
            src={gallery.images[0]}
            alt={gallery.title?.te}
            width={200}
            height={600}
            className={styles.image}
          />
        )}

        {gallery?.description?.te?.html && (
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: gallery.description.te.html }}
          />
        )}

        <AdBlock><SmartAdUnit slot="3315432893" /></AdBlock>

        <div className={styles.grid}>
          {gallery.images?.map((pic: string, i: number) => (
            <GalleryPopup
              key={i}
              images={gallery.images}
              index={i}
              thumbnail={pic}
            />
          ))}
        </div>

        <Reactions newsId={gallery._id} targetModel="Gallery" />
        <Suspense fallback={<div style={{ padding: 20 }}>కామెంట్లు లోడ్ అవుతున్నాయి...</div>}>
          <CommentsServer newsId={gallery._id} targetModel="Gallery" />
        </Suspense>
        <AdBlock><SmartAdUnit slot="3315432893" /></AdBlock>
        <SuggestedGallery items={suggested} />
        <AdBlock><SmartAdUnit slot="9182003090" /></AdBlock>
      </div>

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
