import Link from "next/link";
import Image from "next/image";
import TabTitle from "@/components/common/titles/TabTitle";
import styles from "./Gallery.module.css";
import { getFilteredGallery } from "@/lib/requests";
import { time } from "console";
import GalleryTabs from "./GalleryTabs";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa";

const POSTS_PER_PAGE = 16;

type Props = {
  searchParams: {
    page?: string;
    subcategory?: string;
  };
};

/* ================= SEO ================= */
export const metadata = {
  title: "టీ టైం తెలుగు - గ్యాలరీ",
};

/* ================= PAGE ================= */
export default async function GalleryPage({ searchParams }: Props) {
  const query = await searchParams;   // ⭐ MUST

  const page = Number(query.page) || 1;
  const subcategory = query.subcategory || "";

  /* 🔥 SERVER SIDE FETCH (FAST + SEO) */
  let gallery: any[] = [];
  let totalPages = 1;

  try {
    const res = await getFilteredGallery({
      category: subcategory || "",
      time: "",
      searchText: "",
      page,
      limit: POSTS_PER_PAGE,
    });

    if (res?.status === "success") {
      gallery = res?.gallery || [];
      totalPages = res?.pagination?.totalPages || 1;
    }
  } catch (e) {
    console.error("Gallery fetch failed", e);
  }

  const buildUrl = (p: number) =>
    subcategory
      ? `/gallery?subcategory=${subcategory}&page=${p}`
      : `/gallery?page=${p}`;

  return (
    <main className={styles.container}>
      {/* ===== TITLE ===== */}
      <TabTitle title="గ్యాలరీ" />
      <GalleryTabs />

      {/* ===== GRID ===== */}
      <div className={styles.grid}>
        {gallery.length > 0 ? (
          gallery.map((item) => (
            <Link
              key={item?._id}
              href={`/gallery/${item?.newsId}`}
              className={styles.card}
            >
              <Image
                src={item?.galleryPics?.[0] || "/images/placeholder.png"}
                alt={item?.title?.te}
                fill
                sizes="400px"
                className={styles.image}
              />

              <span className={styles.name}>{item?.title?.te}</span>
            </Link>
          ))
        ) : (
          <p className={styles.empty}>గ్యాలరీలో పోస్ట్‌లు అందుబాటులో లేవు.</p>
        )}
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
    </main>
  );
}
