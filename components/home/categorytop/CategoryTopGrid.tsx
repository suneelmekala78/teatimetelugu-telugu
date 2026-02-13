import Link from "next/link";
import Image from "next/image";
import SectionTitle from "@/components/common/titles/SectionTitle";
import { getFilteredNews } from "@/lib/requests";
import styles from "./CategoryTopGrid.module.css";

/* ================= TYPES ================= */

interface NewsItem {
  _id: string;
  newsId: string;
  mainUrl: string;
  title: { te: string };
  category: { en: string };
}

/* ================= CATEGORY CONFIG ================= */

const CATEGORIES = [
  { key: "movies", label: "సినిమాలు", nav: "/c/movies" },
  { key: "gossips", label: "గాసిప్స్", nav: "/c/gossips" },
  { key: "politics", label: "రాజకీయాలు", nav: "/c/politics" },
  { key: "sports", label: "క్రీడలు", nav: "/c/sports" },
];

/* ================= HELPER ================= */

async function getCategoryPosts(category: string): Promise<NewsItem[]> {
  try {
    const res = await getFilteredNews({
      category,
      page: 2,
      limit: 4,
    });

    if (res?.status === "success") {
      return res.news?.slice(0, 3);
    }
  } catch {}

  return [];
}

/* ================= SERVER COMPONENT ================= */

export default async function CategoryTopGrid() {
  // 🔥 parallel fetching (faster)
  const results = await Promise.all(
    CATEGORIES.map((c) => getCategoryPosts(c.key))
  );

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
                <Link
                  key={post._id}
                  href={`/${post.category.en}/${post.newsId}`}
                  className={styles.card}
                >
                  <div className={styles.imageWrap}>
                    <Image
                      src={post.mainUrl}
                      alt={post.title.te}
                      fill
                      sizes="140px"
                      className={styles.image}
                    />
                  </div>

                  <div className={styles.content}>
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
