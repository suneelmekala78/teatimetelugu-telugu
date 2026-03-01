import Image from "next/image";
import styles from "./GalleryView.module.css";
import LatestStories from "@/components/common/lateststories/LatestStories";
import Social from "@/components/news/social/Social";
import GalleryPopup from "./GalleryPopup";
import Reactions from "@/components/news/reactions/Reactions";
import SuggestedGallery from "@/components/news/suggestedgallery/SuggestedGallery";
import { FaCalendarAlt } from "react-icons/fa";
import CommentsServer from "@/components/news/comments/CommentsServer";
import ReadButton from "@/components/news/readbutton/ReadButton";
import NewsShare from "@/components/common/share/NewsShare";
import SmartAdUnit from "@/components/google-ads/SmartAdUnit";
import AdBlock from "@/components/google-ads/AdBlock";

type Props = {
  gallery: any;
  suggested: any[];
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
      {/* LEFT */}
      <div className={styles.left}>
        <h1 className={styles.title}>{gallery?.title?.te}</h1>

        <div className={styles.metaflex}>
          <div className={styles.meta}>
            <span>
              <FaCalendarAlt />
              {formattedDate}
            </span>
            {gallery?.newsAudio?.te && <ReadButton news={gallery} />}
          </div>

          <NewsShare title={gallery?.title?.te} />
        </div>

        <Image
          src={gallery.galleryPics[0]}
          alt={gallery.title?.te}
          width={200}
          height={600}
          className={styles.image}
        />

        <div
          className={styles.content}
          dangerouslySetInnerHTML={{
            __html: gallery?.description?.te?.withTags,
          }}
        />

        {/* DH AD */}
        <AdBlock>
          <SmartAdUnit
            slot="3315432893"
          />
        </AdBlock>
        
        {/* GRID */}
        <div className={styles.grid}>
          {gallery.galleryPics.map((pic: string, i: number) => (
            <GalleryPopup
              key={i}
              images={gallery.galleryPics}
              index={i}
              thumbnail={pic}
            />
          ))}
        </div>

        <Reactions newsId={gallery._id} isGallery={true} />
        <CommentsServer newsId={gallery._id} />
        {/* DH AD */}
        <AdBlock>
          <SmartAdUnit slot="3315432893"  />
        </AdBlock>
        <SuggestedGallery items={suggested} />
        {/* MH AD */}
        <AdBlock>
          <SmartAdUnit slot="9182003090" />
        </AdBlock>
      </div>

      {/* RIGHT */}
      <aside className={styles.right}>
        <Social />
        {/* DS AD */}
        <AdBlock>
          <SmartAdUnit slot="9180743912" />
        </AdBlock>
        <LatestStories />
        {/* MV AD */}
        <AdBlock>
          <SmartAdUnit slot="6909803795" />
        </AdBlock>
      </aside>
    </main>
  );
}
