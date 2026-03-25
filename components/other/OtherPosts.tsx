import Link from "next/link";
import Image from "next/image";
import SectionTitle from "@/components/common/titles/SectionTitle";
import { getPublishedNews } from "@/lib/requests-server";
import { getCategoryLabel, getSubCategoryLabel } from "@/lib/constants";
import type { News } from "@/types";
import styles from "./OtherPosts.module.css";

interface Props {
  category: string;
}

export default async function OtherPosts({ category }: Props) {
  const res = await getPublishedNews({ category, page: 2, limit: 8 });
  const posts: News[] = res?.success ? res.news || [] : [];

  if (!posts.length) return null;

  return (
    <section className={styles.section}>
      <SectionTitle title={getCategoryLabel(category)} nav={`/c/${category}`} />

      <div className={styles.grid}>
        {posts.map((post) => (
          <article key={post._id} className={styles.card}>
            <Link href={`/${post.category}/${post.slug}`} className={styles.link}>
              <figure className={styles.imageWrap}>
                <Image src={post.thumbnail} alt={post.title?.te} fill sizes="120px" className={styles.image} />
              </figure>
              <div className={styles.content}>
                <span className={styles.category}>
                  {post.subCategory ? getSubCategoryLabel(post.category, post.subCategory) : getCategoryLabel(post.category)}
                </span>
                <h3 className={styles.title}>{post.title?.te}</h3>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
