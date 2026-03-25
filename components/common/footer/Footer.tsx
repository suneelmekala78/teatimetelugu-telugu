import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";
import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <Link href="/" className={styles.logo}>
          <Image src="/images/logo.jpg" alt="Tea Time Telugu logo" width={120} height={70} />
        </Link>
        <nav className={styles.links}>
          <Link href="/about-us">మా గురించి</Link>
          <Link href="/contact-us">మమ్మల్ని సంప్రదించండి</Link>
          <Link href="/privacy-policy">గోప్యతా విధానం</Link>
        </nav>
      </div>

      <div className={styles.bottom}>
        <p className={styles.copy}>
          కాపీరైట్ © 2026 అన్ని హక్కులు{" "}
          <a href="https://eagleiitech.com" target="_blank" rel="noopener noreferrer">
            Eagle Eye Technologies
          </a>{" "}
          సొంతం.
        </p>

        <div className={styles.socials}>
          <a href="https://www.facebook.com/profile.php?id=61582469079953" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={styles.fb}><FaFacebookF /></a>
          <a href="https://www.youtube.com/@TeaTimeTelugu-eet" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className={styles.yt}><FaYoutube /></a>
          <a href="https://x.com/TeaTimeTelugu" target="_blank" rel="noopener noreferrer" aria-label="Twitter X" className={styles.x}><FaXTwitter /></a>
          <a href="https://www.instagram.com/teatime_telugu/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={styles.ig}><FaInstagram /></a>
        </div>
      </div>
    </footer>
  );
}
