import styles from "./SuggestedNews.module.css";
import Link from "next/link";
import Image from "next/image";
import SectionTitle from "@/components/common/titles/SectionTitle";
import type { News } from "@/types";

export default function SuggestedNews({ items = [] }: { items?: News[] }) {
  if (!items.length) return null;

  return (
    <section className={styles.wrapper}>
      <SectionTitle title="సూచించబడిన పోస్ట్‌లు" />

      <div className={styles.list}>
        {items.slice(0, 10).map((post) => (
          <Link key={post._id} href={`/${post.category}/${post.slug}`} className={styles.card}>
            <div className={styles.thumb}>
              <Image
                src={post.thumbnail || "/images/placeholder.png"}
                alt={post.title.te}
                fill
                sizes="120px"
                className={styles.img}
              />
            </div>
            <div className={styles.content}>
              <h3 className={styles.title}>{post.title.te}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
