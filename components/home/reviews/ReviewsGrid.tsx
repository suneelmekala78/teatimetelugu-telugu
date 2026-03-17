import Link from "next/link";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import SectionTitle from "@/components/common/titles/SectionTitle";
import { getCategoryNewsPosts } from "@/lib/requests-server";
import styles from "./ReviewsGrid.module.css";

/* ================= TYPES ================= */

interface ReviewItem {
  _id: string;
  newsId: string;
  mainUrl: string;
  title: { te: string };
  movieRating: number;
  category: { en: string };
}

interface Props {
  reviews?: ReviewItem[];
}

/* ================= SERVER COMPONENT ================= */

export default async function ReviewsGrid({ reviews: prefetched }: Props = {}) {
  let reviews: ReviewItem[] = [];

  if (prefetched?.length) {
    reviews = prefetched.slice(0, 4);
  } else {
    try {
      const res = await getCategoryNewsPosts({
        category: "reviews",
        page: 1,
        limit: 4,
      });

      if (res?.status === "success") {
        reviews = res.news;
      }
    } catch {
      reviews = [];
    }
  }

  if (!reviews.length) return null;

  return (
    <section className={styles.section}>
      <SectionTitle title="సమీక్షలు" nav="/c/reviews" />

      <div className={styles.grid}>
        {reviews.slice(0, 4).map((item) => (
          <Link
            key={item._id}
            href={`/${item.category.en}/${item.newsId}`}
            className={styles.card}
          >
            <div className={styles.imageWrap}>
              <Image
                src={item.mainUrl}
                alt={item.title.te}
                fill
                sizes="300px"
                className={styles.image}
              />
            </div>

            <div className={styles.content}>
              {/* ⭐ Rating */}
              <div className={styles.rating}>
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < (item.movieRating || 0)
                        ? styles.starActive
                        : styles.star
                    }
                  />
                ))}
              </div>

              <h3 className={styles.title}>{item.title.te}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
