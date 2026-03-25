import Link from "next/link";
import Image from "next/image";
import styles from "./BreakingNews.module.css";
import type { PositionedNews } from "@/types";
import { getCategoryLabel } from "@/lib/constants";

interface Props {
  news?: PositionedNews[];
}

export default function BreakingNews({ news }: Props) {
  if (!news?.length) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {news.map((item) => {
          const post = item.news;
          if (!post) return null;

          return (
            <article key={post._id} className={styles.post}>
              <Link
                href={`/${post.category}/${post.slug}`}
                className={styles.link}
              >
                <figure className={styles.imageBox}>
                  <Image
                    src={post.thumbnail}
                    alt={post.title?.te}
                    fill
                    sizes="150px"
                    className={styles.image}
                  />
                </figure>

                <div className={styles.content}>
                  <span className={styles.breaking}>
                    బ్రేకింగ్ న్యూస్
                  </span>

                  <h3 className={styles.title}>
                    {post.title?.te}
                  </h3>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
