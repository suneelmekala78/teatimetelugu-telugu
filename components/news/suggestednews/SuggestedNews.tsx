import styles from "./SuggestedNews.module.css";
import Link from "next/link";
import Image from "next/image";
import SectionTitle from "@/components/common/titles/SectionTitle";

interface SuggestedItem {
  _id: string;
  newsId: string;
  mainUrl?: string;
  title: { te: string };
  category: { te: string; en: string };
}

export default function SuggestedNews({
  items = [],
}: {
  items?: SuggestedItem[];
}) {
  if (!items.length) return null;

  return (
    <section className={styles.wrapper}>
      <SectionTitle title="సూచించబడిన పోస్ట్‌లు" />

      <div className={styles.list}>
        {items.slice(0, 10).map((post) => (
          <Link
            key={post._id}
            href={`/${post.category.en}/${post.newsId}`}
            className={styles.card}
          >
            {/* thumbnail */}
            <div className={styles.thumb}>
              <Image
                src={post.mainUrl || "/placeholder.jpg"}
                alt={post.title.te}
                fill
                sizes="120px"
                className={styles.img}
              />
            </div>

            {/* content */}
            <div className={styles.content}>
              <h3 className={styles.title}>{post.title.te}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
