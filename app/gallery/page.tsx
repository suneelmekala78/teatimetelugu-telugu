import Link from "next/link";
import Image from "next/image";
import TabTitle from "@/components/common/titles/TabTitle";
import styles from "./Gallery.module.css";
import { getPublishedGallery } from "@/lib/requests-server";
import GalleryTabs from "./GalleryTabs";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa";
import SmartAdUnit from "@/components/google-ads/SmartAdUnit";
import AdBlock from "@/components/google-ads/AdBlock";
import type { Gallery } from "@/types";

const POSTS_PER_PAGE = 16;

type Props = {
  searchParams: {
    page?: string;
    subcategory?: string;
  };
};

export const metadata = {
  title: "టీ టైం తెలుగు - గ్యాలరీ",
};

export default async function GalleryPage({ searchParams }: Props) {
  const query = await searchParams;
  const page = Number(query.page) || 1;
  const subcategory = query.subcategory || "";

  let gallery: Gallery[] = [];
  let totalPages = 1;

  try {
    const params: Record<string, string | number> = { page, limit: POSTS_PER_PAGE };
    if (subcategory) params.subCategory = subcategory;

    const res = await getPublishedGallery(params);

    if (res?.success) {
      gallery = res.galleries || [];
      totalPages = res.pagination?.pages || 1;
    }
  } catch (e) {
    console.error("Gallery fetch failed", e);
  }

  const buildUrl = (p: number) =>
    subcategory ? `/gallery?subcategory=${subcategory}&page=${p}` : `/gallery?page=${p}`;

  return (
    <main className={styles.container}>
      <TabTitle title="గ్యాలరీ" />
      <GalleryTabs />

      <div className={styles.grid}>
        {gallery.length > 0 ? (
          gallery.map((item) => (
            <Link key={item._id} href={`/gallery/${item.slug}`} className={styles.card}>
              <Image
                src={item.images?.[0] || item.thumbnail || "/images/placeholder.png"}
                alt={item.title?.te}
                fill
                sizes="400px"
                className={styles.image}
              />
              <span className={styles.name}>{item.title?.te}</span>
            </Link>
          ))
        ) : (
          <p className={styles.empty}>గ్యాలరీలో పోస్ట్‌లు అందుబాటులో లేవు.</p>
        )}
      </div>

      <AdBlock><SmartAdUnit slot="9182003090" /></AdBlock>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          {page > 1 && <Link href={buildUrl(page - 1)}><FaAngleLeft /></Link>}
          <span>పేజీ {page} / {totalPages}</span>
          {page < totalPages && <Link href={buildUrl(page + 1)}><FaAngleRight /></Link>}
        </div>
      )}
    </main>
  );
}
