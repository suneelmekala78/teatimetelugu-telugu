import Link from "next/link";
import Image from "next/image";
import styles from "./Videos.module.css";
import { getPublishedVideos, getVideosBySubCategory } from "@/lib/requests-server";
import { getSubCategoryLabel, formatDate } from "@/lib/constants";
import { FaAngleLeft, FaAngleRight, FaPlay } from "react-icons/fa";
import SmartAdUnit from "@/components/google-ads/SmartAdUnit";
import AdBlock from "@/components/google-ads/AdBlock";
import type { Video } from "@/types";

const POSTS_PER_PAGE = 16;

interface Props {
  subcategory?: string;
  page: number;
}

export default async function VideosGrid({ subcategory, page }: Props) {
  let videos: Video[] = [];
  let totalPages = 1;

  try {
    const res = subcategory
      ? await getVideosBySubCategory(subcategory, { page, limit: POSTS_PER_PAGE })
      : await getPublishedVideos({ page, limit: POSTS_PER_PAGE });

    if (res?.success) {
      videos = res.videos || [];
      totalPages = res.pagination?.pages || 1;
    }
  } catch {
    return <p style={{ padding: 20 }}>Failed to load videos</p>;
  }

  const buildUrl = (p: number) =>
    subcategory ? `/videos?subcategory=${subcategory}&page=${p}` : `/videos?page=${p}`;

  return (
    <>
      <div className={styles.grid}>
        {videos.map((video) => (
          <Link key={video._id} href={`/videos/v/${video.slug}`} className={styles.card}>
            <div className={styles.thumb}>
              <Image src={video.thumbnail} alt={video.title?.te} fill sizes="400px" className={styles.image} />
              <div className={styles.play}><FaPlay /></div>
            </div>
            <div className={styles.text}>
              <span className={styles.meta}>
                {getSubCategoryLabel("videos", video.subCategory)} • {formatDate(video.createdAt)}
              </span>
              <h3 className={styles.title}>{video.title?.te}</h3>
            </div>
          </Link>
        ))}
      </div>

      <AdBlock><SmartAdUnit slot="9182003090" /></AdBlock>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          {page > 1 && <Link href={buildUrl(page - 1)}><FaAngleLeft /></Link>}
          <span>పేజీ {page} / {totalPages}</span>
          {page < totalPages && <Link href={buildUrl(page + 1)}><FaAngleRight /></Link>}
        </div>
      )}
    </>
  );
}
