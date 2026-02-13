"use client";

import { useRouter } from "next/navigation";
import styles from "./Suggestions.module.css";

const tags = ["Cricket", "Movies", "Politics", "Tech", "Hyderabad"];

export default function Suggestions() {
  const router = useRouter();

  return (
    <div className={styles.wrapper}>
      {tags.map((t) => (
        <button key={t} onClick={() => router.push(`/search?q=${t}`)}>
          {t}
        </button>
      ))}
    </div>
  );
}
