import Image from "next/image";
import styles from "./TabTitle.module.css";

interface Props {
  title: string;
  variant?: "tab" | "gallery";
}

export default function TabTitle({ title, variant = "tab" }: Props) {
  return (
    <div
      className={`${styles.container} ${
        variant === "gallery" ? styles.gallery : ""
      }`}
    >
      {/* background image */}
      <Image
        src="/images/tab-bg.jpg"
        alt="background"
        fill
        priority
        className={styles.bg}
      />

      <h1 className={styles.title}>{title}</h1>
    </div>
  );
}
