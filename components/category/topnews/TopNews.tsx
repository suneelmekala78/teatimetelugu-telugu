import Link from "next/link";
import Image from "next/image";
import SectionTitle from "@/components/common/titles/SectionTitle";
import styles from "./TopNews.module.css";
import { getCategoryNews } from "@/lib/requests-server";
import { getCategoryLabel } from "@/lib/constants";
import type { News } from "@/types";

interface Props {
  category: string;
}

export default async function TopNews({ category }: Props) {
  let posts: News[] = [];

  try {
    const res = await getCategoryNews(category, { page: 1, limit: 6, sortBy: "viewCount" });
    if (res?.success) {
      posts = res.news || [];
    }
  } catch {}

  if (!posts.length) return null;

  return (
    <section className={styles.section}>
      <SectionTitle title="ప్రధాన వార్తలు" />

      <div className={styles.grid}>
        {posts.map((post, index) => (
          <article key={post._id} className={styles.card}>
            <Link href={`/${post.category}/${post.slug}`} className={styles.link}>
              <span className={styles.rank}>{index + 1}</span>

              <figure className={styles.imageWrap}>
                <Image src={post.thumbnail} alt={post.title?.te} fill sizes="120px" className={styles.image} />
              </figure>

              <div className={styles.content}>
                <span className={styles.category}>{getCategoryLabel(post.category)}</span>
                <h3 className={styles.title}>{post.title?.te}</h3>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
