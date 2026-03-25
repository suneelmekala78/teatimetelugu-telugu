import Link from "next/link";
import Image from "next/image";
import SectionTitle from "@/components/common/titles/SectionTitle";
import { getPublishedGallery } from "@/lib/requests-server";
import type { Gallery } from "@/types";
import styles from "./GalleryGrid.module.css";

export default async function GalleryGrid() {
  const res = await getPublishedGallery({ page: 1, limit: 6 });
  const gallery: Gallery[] = res?.success ? res.galleries : [];

  if (!gallery.length) return null;

  return (
    <section className={styles.section}>
      <SectionTitle title="గ్యాలరీ" nav="/gallery" />

      <div className={styles.grid}>
        {gallery.map((item) => (
          <Link key={item._id} href={`/gallery/${item.slug}`} className={styles.card}>
            <div className={styles.imageWrap}>
              <Image
                src={item.images?.[0] || item.thumbnail || "/images/placeholder.png"}
                alt={item.name.te}
                fill
                sizes="300px"
                className={styles.image}
              />
            </div>
            <div className={styles.overlay}>
              <h3 className={styles.title}>{item.name.te}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
