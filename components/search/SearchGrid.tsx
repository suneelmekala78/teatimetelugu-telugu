import SearchCard from "./SearchCard";
import styles from "./SearchGrid.module.css";

type Props = {
  items: any[];
};

export default function SearchGrid({ items }: Props) {
  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <SearchCard key={item.newsId} item={item} />
      ))}
    </div>
  );
}
