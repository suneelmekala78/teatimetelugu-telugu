import styles from "./LatestStories.module.css";
import Link from "next/link";
import Image from "next/image";

import SectionTitle from "@/components/common/titles/SectionTitle";
import { getLatestNews } from "@/lib/requests";

/* ---------------- types ---------------- */

interface NewsItem {
  _id: string;
  newsId: string;
  mainUrl?: string;
  title: { te: string };
  category: { te: string; en: string };
}

/* ---------------- server component ---------------- */

export default async function LatestStories() {
  /* 🔥 Runs on SERVER automatically */
  const res = await getLatestNews();

  const news: NewsItem[] = res?.status === "success" ? res.news : [];

  return (
    <section className={styles.wrapper}>
      <SectionTitle title="తాజా కథనాలు" />

      <div className={styles.grid}>
        {news.map((post) => (
          <article key={post._id} className={styles.card}>
            <Link
              href={`/${post.category.en}/${post.newsId}`}
              className={styles.link}
            >
              <figure className={styles.imageBox}>
                <Image
                  src={post.mainUrl || "/placeholder.jpg"}
                  alt={post.title.te}
                  fill
                  sizes="100px"
                  className={styles.image}
                />
              </figure>

              <div className={styles.content}>
                <span className={styles.category}>
                  {post.category.te}
                </span>

                <h3 className={styles.title}>
                  {post.title.te}
                </h3>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
