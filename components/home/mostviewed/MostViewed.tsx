import Link from "next/link";
import Image from "next/image";
import SectionTitle from "@/components/common/titles/SectionTitle";
import { getMostviewedNews } from "@/lib/requests-server";
import styles from "./MostViewed.module.css";

/* ================= TYPES ================= */

interface NewsItem {
  _id: string;
  newsId: string;
  mainUrl: string;
  title: { te: string };
  category: { te: string; en: string };
}

interface Props {
  news?: NewsItem[];
}

/* ================= SERVER COMPONENT ================= */

export default async function MostViewed({ news: prefetched }: Props = {}) {
  let news: NewsItem[] = [];

  if (prefetched?.length) {
    news = prefetched.slice(0, 6);
  } else {
    try {
      const res = await getMostviewedNews();

      if (res?.status === "success") {
        news = res.news?.slice(0, 6);
      }
    } catch {
      news = [];
    }
  }

  if (!news.length) return null;

  return (
    <section className={styles.section}>
      <SectionTitle title="అత్యంత వీక్షించబడినవి" />

      <div className={styles.grid}>
        {news.map((item) => (
          <Link
            key={item._id}
            href={`/${item.category.en}/${item.newsId}`}
            className={styles.card}
          >
            <div className={styles.imageWrap}>
              <Image
                src={item.mainUrl}
                alt={item.title.te}
                fill
                sizes="250px"
                className={styles.image}
              />
            </div>

            <div className={styles.content}>
              <span className={styles.category}>
                {item.category.te}
              </span>

              <h3 className={styles.title}>
                {item.title.te}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
