import Link from "next/link";
import Image from "next/image";
import SectionTitle from "@/components/common/titles/SectionTitle";
import type { PositionedNews } from "@/types";
import { getCategoryLabel, formatDate } from "@/lib/constants";
import styles from "./TrendingGrid.module.css";

interface Props {
  news?: PositionedNews[];
}

export default function TrendingGrid({ news }: Props) {
  if (!news?.length) return null;

  const items = news.map((n) => n.news).filter(Boolean);
  if (!items.length) return null;

  const main = items[0];
  const others = items.slice(1, 5);

  return (
    <section className={styles.section}>
      <SectionTitle title="ట్రెండింగ్ వార్తలు" />

      <div className={styles.grid}>
        <Link href={`/${main.category}/${main.slug}`} className={styles.mainCard}>
          <div className={styles.mainImage}>
            <Image src={main.thumbnail} alt={main.title.te} fill priority sizes="600px" className={styles.image} />
          </div>
          <div className={styles.texts}>
            <span className={styles.category}>
              {getCategoryLabel(main.category)} • {formatDate(main.publishedAt || "")}
            </span>
            <h2 className={styles.mainTitle}>{main.title.te}</h2>
          </div>
        </Link>

        <div className={styles.list}>
          {others.map((item) => (
            <Link key={item._id} href={`/${item.category}/${item.slug}`} className={styles.listItem}>
              <div className={styles.thumb}>
                <Image src={item.thumbnail} alt={item.title.te} fill sizes="120px" className={styles.image} />
              </div>
              <div className={styles.texts}>
                <span className={styles.category}>
                  {getCategoryLabel(item.category)} • {formatDate(item.publishedAt || "")}
                </span>
                <h3 className={styles.title}>{item.title.te}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
