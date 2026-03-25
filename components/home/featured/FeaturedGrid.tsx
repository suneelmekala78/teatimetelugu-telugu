import Link from "next/link";
import Image from "next/image";
import SectionTitle from "@/components/common/titles/SectionTitle";
import { getLatestNews } from "@/lib/requests-server";
import { getCategoryLabel } from "@/lib/constants";
import type { News } from "@/types";
import styles from "./FeaturedGrid.module.css";

export default async function FeaturedGrid() {
  const res = await getLatestNews();
  const news: News[] = res?.success ? res.news : [];

  if (!news.length) return null;

  return (
    <section className={styles.section}>
      <SectionTitle title="తాజా వార్తలు" />

      <div className={styles.grid}>
        {news.map((item) => (
          <article key={item._id} className={styles.card}>
            <Link href={`/${item.category}/${item.slug}`} className={styles.link}>
              <div className={styles.imageWrap}>
                <Image
                  src={item.thumbnail}
                  alt={item.title.te}
                  fill
                  sizes="300px"
                  className={styles.image}
                />
              </div>

              <div className={styles.content}>
                <span className={styles.category}>
                  {getCategoryLabel(item.category)}
                </span>
                <h3 className={styles.title}>{item.title.te}</h3>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
