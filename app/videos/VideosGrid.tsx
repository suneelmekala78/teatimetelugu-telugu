import Link from "next/link";
import Image from "next/image";
import styles from "./Videos.module.css";
import { getFilteredVideos } from "@/lib/requests";
import { FaAngleLeft, FaAngleRight, FaPlay } from "react-icons/fa";

const POSTS_PER_PAGE = 16;

interface Props {
  subcategory?: string;
  page: number;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("te-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

export default async function VideosGrid({ subcategory, page }: Props) {
  let videos: any[] = [];
  let totalPages = 1;

  try {
    const res = await getFilteredVideos({
      category: subcategory || "",
      time: "",
      searchText: "",
      page,
      limit: POSTS_PER_PAGE,
    });

    if (res?.status === "success") {
      videos = res.videos || [];
      totalPages = res.pagination?.totalPages || 1;
    }
  } catch {
    return <p style={{ padding: 20 }}>Failed to load videos</p>;
  }

  const buildUrl = (p: number) =>
    subcategory
      ? `/videos?subcategory=${subcategory}&page=${p}`
      : `/videos?page=${p}`;

  return (
    <>
      {/* ===== GRID ===== */}
      <div className={styles.grid}>
        {videos.map((video) => (
          <Link
            key={video._id}
            href={`/videos/v/${video.newsId}`}
            className={styles.card}
          >
            <div className={styles.thumb}>
              <Image
                src={video.mainUrl}
                alt={video.title?.te}
                fill
                sizes="400px"
                className={styles.image}
              />

              <div className={styles.play}>
                <FaPlay />
              </div>
            </div>

            <div className={styles.text}>
              <span className={styles.meta}>
                {video.subCategory?.te || "తాజా వీడియో"} •{" "}
                  {formatDate(video?.createdAt)}
              </span>

              <h3 className={styles.title}>{video.title?.te}</h3>
            </div>
          </Link>
        ))}
      </div>

      {/* ===== PAGINATION ===== */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          {page > 1 && (
            <Link href={buildUrl(page - 1)}>
              <FaAngleLeft />
            </Link>
          )}

          <span>
            పేజీ {page} / {totalPages}
          </span>

          {page < totalPages && (
            <Link href={buildUrl(page + 1)}>
              <FaAngleRight />
            </Link>
          )}
        </div>
      )}
    </>
  );
}
