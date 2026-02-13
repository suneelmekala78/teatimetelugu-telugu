import Link from "next/link";
import Image from "next/image";
import SectionTitle from "@/components/common/titles/SectionTitle";
import { getFilteredGallery } from "@/lib/requests";
import styles from "./GalleryGrid.module.css";

/* ================= TYPES ================= */

interface GalleryItem {
  _id: string;
  newsId: string;
  name: { te: string; en: string };
  category: { te: string };
  galleryPics: string[];
}

/* ================= SERVER COMPONENT ================= */

export default async function GalleryGrid() {
  let gallery: GalleryItem[] = [];

  try {
    // fetch max 6 always (CSS controls layout)
    const res = await getFilteredGallery({
      page: 1,
      limit: 6,
    });

    if (res?.status === "success") {
      gallery = res.gallery;
    }
  } catch {
    gallery = [];
  }

  if (!gallery.length) return null;

  return (
    <section className={styles.section}>
      <SectionTitle title="గ్యాలరీ" nav="/gallery" />

      <div className={styles.grid}>
        {gallery.map((item) => (
          <Link
            key={item._id}
            href={`/gallery/${item.newsId}`}
            className={styles.card}
          >
            <div className={styles.imageWrap}>
              <Image
                src={
                  item.galleryPics?.[0] ||
                  "/placeholder.webp"
                }
                alt={item.name.te}
                fill
                sizes="300px"
                className={styles.image}
              />
            </div>

            <div className={styles.overlay}>
              <span className={styles.category}>
                {item.category.te}
              </span>

              <h3 className={styles.title}>
                {item.name.te}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
