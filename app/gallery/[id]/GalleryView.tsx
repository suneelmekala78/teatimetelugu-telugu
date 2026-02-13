import Image from "next/image";
import styles from "./GalleryView.module.css";
import Comments from "@/components/news/comments/Comments";
import LatestStories from "@/components/common/lateststories/LatestStories";
import Social from "@/components/news/social/Social";
import GalleryPopup from "./GalleryPopup";
import Reactions from "@/components/news/reactions/Reactions";
import SuggestedGallery from "@/components/news/suggestedgallery/SuggestedGallery";
import { FaCalendarAlt } from "react-icons/fa";

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

        <p className={styles.meta}>
          <FaCalendarAlt /> {formattedDate}
        </p>

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

        <Reactions newsId={gallery._id} />
        <Comments newsId={gallery._id} />
        <SuggestedGallery items={suggested} />
      </div>

      {/* RIGHT */}
      <aside className={styles.right}>
        <Social />
        <LatestStories />
      </aside>
    </main>
  );
}
