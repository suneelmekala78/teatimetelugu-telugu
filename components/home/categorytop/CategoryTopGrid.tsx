import Link from "next/link";
import Image from "next/image";
import SectionTitle from "@/components/common/titles/SectionTitle";
import { getPublishedNews } from "@/lib/requests-server";
import { getCategoryLabel, getSubCategoryLabel } from "@/lib/constants";
import type { News } from "@/types";
import styles from "./CategoryTopGrid.module.css";

const CATEGORIES = [
  { key: "movies", label: "సినిమాలు", nav: "/c/movies" },
  { key: "gossips", label: "గాసిప్స్", nav: "/c/gossips" },
  { key: "politics", label: "రాజకీయాలు", nav: "/c/politics" },
  { key: "sports", label: "క్రీడలు", nav: "/c/sports" },
];

async function getCategoryPosts(category: string): Promise<News[]> {
  try {
    const res = await getPublishedNews({ category, page: 1, limit: 3 });
    if (res?.success) return (res.news || []).slice(0, 3);
  } catch {}
  return [];
}

export default async function CategoryTopGrid() {
  const results = await Promise.all(CATEGORIES.map((c) => getCategoryPosts(c.key)));

  return (
    <section className={styles.container}>
      {CATEGORIES.map((cat, index) => {
        const posts = results[index];
        if (!posts.length) return null;

        return (
          <div key={cat.key} className={styles.section}>
            <SectionTitle title={cat.label} nav={cat.nav} />
            <div className={styles.grid}>
              {posts.map((post) => (
                <Link key={post._id} href={`/${post.category}/${post.slug}`} className={styles.card}>
                  <div className={styles.imageWrap}>
                    <Image src={post.thumbnail} alt={post.title.te} fill sizes="140px" className={styles.image} />
                  </div>
                  <div className={styles.content}>
                    <p className={styles.subCategory}>
                      {post.subCategory ? getSubCategoryLabel(post.category, post.subCategory) : getCategoryLabel(post.category)}
                    </p>
                    <h3 className={styles.title}>{post.title.te}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
