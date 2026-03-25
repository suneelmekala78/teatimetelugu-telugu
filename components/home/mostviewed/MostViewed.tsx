import Link from "next/link";
import Image from "next/image";
import SectionTitle from "@/components/common/titles/SectionTitle";
import { getMostViewedNews } from "@/lib/requests-server";
import { getCategoryLabel } from "@/lib/constants";
import type { News } from "@/types";
import styles from "./MostViewed.module.css";

export default async function MostViewed() {
  const res = await getMostViewedNews();
  const news: News[] = res?.success ? (res.news || []).slice(0, 6) : [];

  if (!news.length) return null;

  return (
    <section className={styles.section}>
      <SectionTitle title="అత్యంత వీక్షించబడినవి" />

      <div className={styles.grid}>
        {news.map((item) => (
          <Link key={item._id} href={`/${item.category}/${item.slug}`} className={styles.card}>
            <div className={styles.imageWrap}>
              <Image src={item.thumbnail} alt={item.title.te} fill sizes="250px" className={styles.image} />
            </div>
            <div className={styles.content}>
              <span className={styles.category}>{getCategoryLabel(item.category)}</span>
              <h3 className={styles.title}>{item.title.te}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
