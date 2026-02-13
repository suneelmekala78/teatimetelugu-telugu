import styles from "./Tags.module.css";
import Link from "next/link";
import SectionTitle from "@/components/common/titles/SectionTitle";

/* ---------------- types ---------------- */

interface Props {
  tags?: {
    te?: string[];
  };
}

/* ---------------- component ---------------- */

export default function Tags({ tags }: Props) {
  const tagList = tags?.te ?? [];

  if (!tagList.length) return null;

  return (
    <div className={styles.wrapper}>
      <SectionTitle title="ట్యాగ్లు" />

      <div className={styles.list}>
        {tagList.map((tag) => (
          <Link
            key={tag}
            href={`/search?q=${encodeURIComponent(tag)}`}
            className={styles.tag}
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
}
