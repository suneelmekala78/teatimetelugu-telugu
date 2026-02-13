import Image from "next/image";
import Link from "next/link";
import styles from "./SuggestedGallery.module.css";
import SectionTitle from "@/components/common/titles/SectionTitle";

type Props = {
  items: any[];
};

export default function SuggestedGallery({ items }: Props) {
  if (!items?.length) return null;

  return (
    <section className={styles.wrapper}>
      <SectionTitle title="సూచించబడిన గ్యాలరీలు" />

      <div className={styles.grid}>
        {items.slice(0, 9).map((item) => (
          <Link
            key={item._id}
            href={`/gallery/${item.newsId}`}
            className={styles.card}
          >
            <div className={styles.imageWrap}>
              <Image
                src={item.galleryPics?.[0] || "/placeholder.jpg"}
                alt={item.title?.te}
                fill
                sizes="300px"
                className={styles.image}
              />
            </div>

            <div className={styles.content}>
              <span className={styles.category}>
                {item.category?.te}
              </span>

              <h3 className={styles.title}>
                {item.title?.te}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
