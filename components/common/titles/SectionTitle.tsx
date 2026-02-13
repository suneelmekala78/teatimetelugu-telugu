"use client";

import Link from "next/link";
import { FaAngleRight } from "react-icons/fa";
import styles from "./SectionTitle.module.css";

interface Props {
  title: string;
  nav?: string;
}

export default function SectionTitle({ title, nav }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <span className={styles.text}>{title}</span>
        <span className={styles.dot} />
        <span className={styles.line} />
      </div>

      {nav && (
        <Link href={nav} className={styles.seeAll}>
          మరిన్ని చూడండి <FaAngleRight />
        </Link>
      )}
    </div>
  );
}
