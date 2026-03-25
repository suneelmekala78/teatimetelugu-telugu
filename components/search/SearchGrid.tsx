import SearchCard from "./SearchCard";
import styles from "./SearchGrid.module.css";

type Props = {
  items: unknown[];
};

export default function SearchGrid({ items }: Props) {
  return (
    <div className={styles.grid}>
      {(items as Record<string, unknown>[]).map((item, i) => {
        const id = (item?.slug || item?._id || i) as string;
        const type = (item?.type || "news") as string;
        return <SearchCard key={`${type}:${id}`} item={item as any} />;
      })}
    </div>
  );
}
