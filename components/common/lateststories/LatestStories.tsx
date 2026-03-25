import styles from "./LatestStories.module.css";
import Link from "next/link";
import Image from "next/image";
import SectionTitle from "@/components/common/titles/SectionTitle";
import { getLatestNews } from "@/lib/requests-server";
import { getCategoryLabel } from "@/lib/constants";
import type { News } from "@/types";

export default async function LatestStories() {
  const res = await getLatestNews();
  const news: News[] = res?.success ? res.news : [];

  return (
    <section className={styles.wrapper}>
      <SectionTitle title="తాజా కథనాలు" />

      <div className={styles.grid}>
        {news.map((post) => (
          <article key={post._id} className={styles.card}>
            <Link href={`/${post.category}/${post.slug}`} className={styles.link}>
              <figure className={styles.imageBox}>
                <Image
                  src={post.thumbnail || "/images/placeholder.png"}
                  alt={post.title.te}
                  fill
                  sizes="100px"
                  className={styles.image}
                />
              </figure>
              <div className={styles.content}>
                <span className={styles.category}>{getCategoryLabel(post.category)}</span>
                <h3 className={styles.title}>{post.title.te}</h3>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
