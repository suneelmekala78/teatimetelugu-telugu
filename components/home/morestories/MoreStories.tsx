import Link from "next/link";
import Image from "next/image";
import SectionTitle from "@/components/common/titles/SectionTitle";
import { getFilteredNews } from "@/lib/requests";
import styles from "./MoreStories.module.css";

/* ================= TYPES ================= */

interface NewsItem {
  _id: string;
  newsId: string;
  mainUrl: string;
  title: { te: string };
  category: { te: string; en: string };
}

/* ================= SERVER COMPONENT ================= */

export default async function MoreStories() {
  let news: NewsItem[] = [];

  try {
    const res = await getFilteredNews({
      category: "",
      time: "",
      searchText: "",
      writer: "",
      page: 2,
      limit: 12,
    });

    if (res?.status === "success") {
      news = res.news;
    }
  } catch {
    news = [];
  }

  return (
    <section className={styles.section}>
      <SectionTitle title="మరిన్ని కథనాలు" />

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
                <span className={styles.category}>{item.category.te}</span>

                <h3 className={styles.title}>{item.title.te}</h3>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
