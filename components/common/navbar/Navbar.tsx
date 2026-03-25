"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { FaFacebookF, FaYoutube, FaInstagram, FaBars, FaTimes } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { MdLogout, MdLogin } from "react-icons/md";
import styles from "./Navbar.module.css";
import { useUserStore } from "@/store/useUserStore";
import { FaCalendarDays, FaXTwitter } from "react-icons/fa6";
import AuthPopupWrapper from "../popups/auth/AuthPopupWrapper";
import { logoutUser } from "@/lib/requests-client";

const NAV_ITEMS = [
  { href: "/", label: "హోమ్" },
  { href: "/c/general", label: "జనరల్" },
  { href: "/c/politics", label: "రాజకీయం" },
  { href: "/c/movies", label: "సినిమా" },
  { href: "/c/gossips", label: "గాసిప్స్" },
  { href: "/c/reviews", label: "రివ్యూస్" },
  { href: "/gallery", label: "గ్యాలరీ" },
  { href: "/videos", label: "వీడియోలు" },
  { href: "/c/ott", label: "ఓటిటి" },
  { href: "/c/sports", label: "క్రీడలు" },
  { href: "/c/business", label: "బిజినెస్" },
  { href: "/c/technology", label: "టెక్నాలజీ" },
  { href: "/c/health", label: "ఆరోగ్యం" },
];

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isJoin, setIsJoin] = useState(false);

  const isActive = (path: string) => pathname === path;

  const query = searchParams.toString();
  const fullPath = query ? `${pathname}?${query}` : pathname;
  const redirectUrl = `${process.env.NEXT_PUBLIC_REDIRECT_URL}${fullPath}`;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setDate(
      new Date().toLocaleDateString("te-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return toast("Search something...");
    router.push(`/search?q=${encodeURIComponent(search)}`);
    setSearch("");
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {}
    logout();
    toast.success("విజయవంతంగా లాగ్ అవుట్ అయ్యారు");
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <header className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
        <div className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <span className={styles.date}><FaCalendarDays /> {date}</span>
            <div className={styles.topLinks}>
              <Link href="/about-us">మన గురించి</Link>
              <Link href="/contact-us">సంప్రదించండి</Link>
              <Link href="/privacy-policy">గోప్యతా విధానం</Link>
            </div>
          </div>
          <div className={styles.socials}>
            <a href="https://www.facebook.com/profile.php?id=61582469079953" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={styles.fb}><FaFacebookF /></a>
            <a href="https://www.youtube.com/@TeaTimeTelugu-eet" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className={styles.yt}><FaYoutube /></a>
            <a href="https://x.com/TeaTimeTelugu" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className={styles.x}><FaXTwitter /></a>
            <a href="https://www.instagram.com/teatime_telugu/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={styles.ig}><FaInstagram /></a>
          </div>
        </div>

        <div className={styles.logoRow}>
          <Link href="/"><Image src="/images/logo.jpg" alt="Tea Time Telugu" width={140} height={80} priority className={styles.logo} /></Link>
        </div>

        <nav className={styles.menu}>
          <div className={styles.tabsContainer}>
            <div className={styles.tabs}>
              {NAV_ITEMS.map((item) => (
                <Link key={item.href} href={item.href} className={`${styles.tabLink} ${isActive(item.href) ? styles.active : ""}`}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className={styles.right}>
            <Link href="/search" className={styles.searchBtn} aria-label="Search"><FiSearch /></Link>
            <a href={redirectUrl} target="_blank" rel="noopener noreferrer" className={styles.langBtn}>ENGLISH</a>
            {user ? (
              <button onClick={() => setShowLogoutConfirm(true)} className={styles.logoutBtn} title="Logout"><MdLogout /></button>
            ) : (
              <div className={styles.loginBtn} onClick={() => setIsJoin(true)} title="Login"><MdLogin /><span>Login</span></div>
            )}
          </div>
        </nav>

        <div className={styles.mobileHeader}>
          <Link href="/"><Image src="/images/logo.jpg" alt="logo" width={120} height={60} className={styles.mobileLogo} /></Link>
          <div className={styles.mobileActions}>
            <Link href="/search" className={styles.mobileSearchBtn} aria-label="Search"><FiSearch /></Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className={styles.mobileMenuBtn} aria-label={mobileOpen ? "Close menu" : "Open menu"}>
              {mobileOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        <div className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ""}`}>
          <div className={styles.mobileMenuContent}>
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className={`${styles.mobileLink} ${isActive(item.href) ? styles.active : ""}`} onClick={() => setMobileOpen(false)}>
                {item.label}
              </Link>
            ))}
            <div className={styles.mobileBottomActions}>
              <a href={redirectUrl} target="_blank" rel="noopener noreferrer" className={styles.mobileLangBtn}>English</a>
              {user ? (
                <button onClick={() => setShowLogoutConfirm(true)} className={styles.mobileLogoutBtn}><MdLogout /> లాగ్ అవుట్</button>
              ) : (
                <button className={styles.mobileLoginBtn} onClick={() => { setMobileOpen(false); setIsJoin(true); }}><MdLogin /> లాగిన్</button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthPopupWrapper open={isJoin} onClose={() => setIsJoin(false)} />

      {showLogoutConfirm && (
        <div className={styles.logoutModal}>
          <div className={styles.logoutModalContent}>
            <p className={styles.logoutModalText}>మీరు ఖచ్చితంగా లాగ్ అవుట్ చేయాలనుకుంటున్నారా?</p>
            <div className={styles.logoutModalActions}>
              <button onClick={() => setShowLogoutConfirm(false)} className={styles.logoutCancelBtn}>లేదు</button>
              <button onClick={handleLogout} className={styles.logoutConfirmBtn}>అవును</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
