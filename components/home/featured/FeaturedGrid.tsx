import Link from "next/link";
import Image from "next/image";
import SectionTitle from "@/components/common/titles/SectionTitle";
import { getLatestNews } from "@/lib/requests";
import styles from "./FeaturedGrid.module.css";

/* ================= TYPES ================= */

interface NewsItem {
  _id: string;
  newsId: string;
  mainUrl: string;
  title: { te: string };
  category: { te: string; en: string };
}

/* ================= SERVER COMPONENT ================= */

export default async function FeaturedGrid() {
  let news: NewsItem[] = [];

  try {
    const res = await getLatestNews();

    if (res?.status === "success") {
      news = res.news;
    }
  } catch {
    news = [];
  }

  return (
    <section className={styles.section}>
      <SectionTitle title="తాజా వార్తలు" />

      <div className={styles.grid}>
        {news.map((item) => (
          <article key={item._id} className={styles.card}>
            <Link
              href={`/${item.category.en}/${item.newsId}`}
              className={styles.link}
            >
              <div className={styles.imageWrap}>
                <Image
                  src={item.mainUrl}
                  alt={item.title.te}
                  fill
                  sizes="300px"
                  className={styles.image}
                  priority={false}
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
          </article>
        ))}
      </div>
    </section>
  );
}
