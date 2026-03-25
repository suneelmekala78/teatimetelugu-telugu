import SectionTitle from "@/components/common/titles/SectionTitle";
import ScrollCarousel from "./ScrollCarousel";
import type { PositionedNews } from "@/types";
import styles from "./ScrollGrid.module.css";

interface Props {
  news?: PositionedNews[];
}

export default function ScrollGrid({ news }: Props) {
  if (!news?.length) return null;

  const items = news
    .map((n) => n.news)
    .filter(Boolean)
    .map((post) => ({
      _id: post._id,
      slug: post.slug,
      thumbnail: post.thumbnail,
      title: post.title,
      category: post.category,
    }));

  if (!items.length) return null;

  return (
    <section className={styles.container}>
      <SectionTitle title="ఈరోజు హాట్ టాపిక్స్" />
      <ScrollCarousel items={items} />
    </section>
  );
}
