import SectionTitle from "@/components/common/titles/SectionTitle";
import { getHotTopics } from "@/lib/requests";
import ScrollCarousel from "./ScrollCarousel";
import styles from "./ScrollGrid.module.css";

interface NewsItem {
  _id: string;
  newsId: string;
  mainUrl: string;
  title: { te: string };
  category: { en: string };
}

export default async function ScrollGrid() {
  let topics: NewsItem[] = [];

  try {
    const res = await getHotTopics();
    if (res?.status === "success") {
      topics = res.news;
    }
  } catch {
    topics = [];
  }

  if (!topics.length) return null;

  return (
    <section className={styles.container}>
      <SectionTitle title="ఈరోజు హాట్ టాపిక్స్" />
      <ScrollCarousel items={topics} />
    </section>
  );
}
