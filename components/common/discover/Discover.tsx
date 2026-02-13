import Link from "next/link";
import Image from "next/image";
import SectionTitle from "@/components/common/titles/SectionTitle";
import styles from "./Discover.module.css";

/* ================= DATA ================= */

const items = [
  { label: "సినిమా", href: "/c/movies", img: "/images/discover/movies.webp" },
  { label: "గ్యాలరీ", href: "/gallery", img: "/images/discover/gallery.jpg" },
  { label: "ఓటిటి", href: "/c/ott", img: "/images/discover/ott.webp" },
  { label: "రివ్యూస్", href: "/c/reviews", img: "/images/discover/reviews.webp" },
  { label: "గాసిప్స్", href: "/c/gossips", img: "/images/discover/gossips.webp" },
  { label: "వీడియోలు", href: "/videos", img: "/images/discover/videos.jpg" },

  { label: "రాజకీయం", href: "/c/politics", img: "/images/discover/politics.jpg" },
  { label: "జనరల్", href: "/c/news", img: "/images/discover/general.jpg" },
  { label: "క్రీడలు", href: "/c/sports", img: "/images/discover/sports.avif" },
  { label: "బిజినెస్", href: "/c/business", img: "/images/discover/business.webp" },
  { label: "టెక్నాలజీ", href: "/c/technology", img: "/images/discover/tech.jpg" },
  { label: "ఆరోగ్యం", href: "/c/health", img: "/images/discover/health.jpg" },
];

/* ================= COMPONENT ================= */

export default function Discover() {
  return (
    <section className={styles.container}>
      <SectionTitle title="కనుగొనండి" />

      <div className={styles.grid}>
        {items.map((item) => (
          <Link key={item.href} href={item.href} className={styles.card}>
            <Image
              src={item.img}
              alt={item.label}
              fill
              sizes="180px"
              className={styles.image}
              priority={false}
            />
            <span className={styles.label}>{item.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
