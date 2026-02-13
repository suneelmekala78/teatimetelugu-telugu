import Link from "next/link";
import styles from "./not-found.module.css";
import { FaHome, FaSearch } from "react-icons/fa";

export default function NotFound() {
  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.code}>404</h1>

        <h2 className={styles.title}>పేజీ కనబడలేదు</h2>

        <p className={styles.desc}>
          మీరు వెతుకుతున్న పేజీ అందుబాటులో లేదు లేదా తొలగించబడింది.
        </p>

        <div className={styles.actions}>
          <Link href="/" className={styles.primaryBtn}>
            <FaHome /> హోమ్
          </Link>

          <Link href="/search" className={styles.secondaryBtn}>
            <FaSearch /> వెతకండి
          </Link>
        </div>
      </div>
    </section>
  );
}
