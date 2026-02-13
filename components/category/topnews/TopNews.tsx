import Link from "next/link";
import Image from "next/image";
import SectionTitle from "@/components/common/titles/SectionTitle";
import styles from "./TopNews.module.css";
import { getCategoryTopPosts } from "@/lib/requests";

interface Props {
  category: string;
}

export default async function TopNews({ category }: Props) {
  let posts: any[] = [];
  let error = "";

  try {
    const res = await getCategoryTopPosts(category);

    if (res?.status === "success") {
      posts = res.posts || [];
    }
  } catch {
    error = "Failed to load top posts. Please try again later.";
  }

  if (!posts.length && !error) return null;

  return (
    <section className={styles.section}>
      {posts.length > 0 && <SectionTitle title="ప్రధాన వార్తలు" />}

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.grid}>
        {posts.map((post, index) => (
          <article key={post?._id} className={styles.card}>
            <Link
              href={`/${post?.category?.en}/${post?.newsId}`}
              className={styles.link}
            >
              <span className={styles.rank}>{index + 1}</span>

              <figure className={styles.imageWrap}>
                <Image
                  src={post?.mainUrl}
                  alt={post?.title?.te}
                  fill
                  sizes="120px"
                  className={styles.image}
                />
              </figure>

              <div className={styles.content}>
                <span className={styles.category}>
                  {post?.category?.te}
                </span>

                <h3 className={styles.title}>
                  {post?.title?.te}
                </h3>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
