import Link from "next/link";
import Image from "next/image";
import SectionTitle from "@/components/common/titles/SectionTitle";
import { getFilteredNews } from "@/lib/requests";
import styles from "./OtherPosts.module.css";

/* ================= TYPES ================= */

interface Props {
  category: string;
}

/* ================= COMPONENT ================= */

export default async function OtherPosts({ category }: Props) {
  let posts: any[] = [];

  try {
    const res = await getFilteredNews({
      category,
      page: 2,
      limit: 8,
    });

    if (res?.status === "success") {
      posts = res.news || [];
    }
  } catch {
    posts = [];
  }

  if (!posts.length) return null;

  return (
    <section className={styles.section}>
      <SectionTitle
        title={posts[0]?.category?.te}
        nav={`/c/${category}`}
      />

      <div className={styles.grid}>
        {posts.map((post) => (
          <article key={post._id} className={styles.card}>
            <Link
              href={`/${post.category?.en}/${post.newsId}`}
              className={styles.link}
            >
              {/* IMAGE */}
              <figure className={styles.imageWrap}>
                <Image
                  src={post.mainUrl}
                  alt={post.title?.te}
                  fill
                  sizes="120px"
                  className={styles.image}
                />
              </figure>

              {/* CONTENT */}
              <div className={styles.content}>
                <span className={styles.category}>
                  {post.subCategory?.te || post.category?.te}
                </span>

                <h3 className={styles.title}>
                  {post.title?.te}
                </h3>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
