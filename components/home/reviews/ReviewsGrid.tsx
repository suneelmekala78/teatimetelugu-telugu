import Link from "next/link";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import SectionTitle from "@/components/common/titles/SectionTitle";
import { getCategoryNews } from "@/lib/requests-server";
import type { News } from "@/types";
import styles from "./ReviewsGrid.module.css";

export default async function ReviewsGrid() {
  const res = await getCategoryNews("reviews", { page: 1, limit: 4 });
  const reviews: News[] = res?.success ? (res.news || []).slice(0, 4) : [];

  if (!reviews.length) return null;

  return (
    <section className={styles.section}>
      <SectionTitle title="సమీక్షలు" nav="/c/reviews" />

      <div className={styles.grid}>
        {reviews.map((item) => (
          <Link key={item._id} href={`/${item.category}/${item.slug}`} className={styles.card}>
            <div className={styles.imageWrap}>
              <Image src={item.thumbnail} alt={item.title.te} fill sizes="300px" className={styles.image} />
            </div>
            <div className={styles.content}>
              <div className={styles.rating}>
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < (item.movieRating || 0) ? styles.starActive : styles.star}
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
