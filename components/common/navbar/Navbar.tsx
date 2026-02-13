"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import { FiSearch } from "react-icons/fi";
import { MdLogout, MdLogin } from "react-icons/md";

import styles from "./Navbar.module.css";
import { useUserStore } from "@/store/useUserStore";
import { FaCalendarDays, FaXTwitter } from "react-icons/fa6";
import AuthPopup from "../popups/auth/AuthPopup";

/* ---------------- NAV TABS ---------------- */

const NAV_ITEMS = [
  { href: "/", label: "హోమ్" },
  { href: "/c/news", label: "జనరల్" },
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
  const router = useRouter();

  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isJoin, setIsJoin] = useState(false);

  const isActive = (path: string) => pathname === path;

  /* ---------- SCROLL EFFECT ---------- */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ---------- DATE ---------- */
  useEffect(() => {
    const today = new Date();
    setDate(
      today.toLocaleDateString("te-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    );
  }, []);

  /* ---------- SEARCH ---------- */
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();

    if (!search.trim()) {
      toast("Search something...");
      return;
    }

    router.push(`/search?q=${encodeURIComponent(search)}`);
    setSearch("");
    setMobileOpen(false);
  };

  /* ---------- LOGOUT ---------- */
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <header
        className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}
      >
        {/* ===== TOP BAR ===== */}
        <div className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <span className={styles.date}>
              <FaCalendarDays /> {date}
            </span>

            <div className={styles.topLinks}>
              <Link href={"/about"}>మన గురించి</Link>
              <Link href={"/contact"}>సంప్రదించండి</Link>
              <Link href={"/privacy"}>గోప్యతా విధానం</Link>
            </div>
          </div>

          <div className={styles.socials}>
            <a href="#" aria-label="Facebook" className={styles.fb}>
              <FaFacebookF />
            </a>
            <a href="#" aria-label="YouTube" className={styles.yt}>
              <FaYoutube />
            </a>
            <a href="#" aria-label="Twitter" className={styles.x}>
              <FaXTwitter />
            </a>
            <a href="#" aria-label="Instagram" className={styles.ig}>
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* ===== LOGO ROW ===== */}
        <div className={styles.logoRow}>
          <Link href="/">
            <Image
              src="/images/logo.jpg"
              alt="Tea Time Telugu"
              width={140}
              height={80}
              priority
              className={styles.logo}
            />
          </Link>
        </div>

        {/* ===== DESKTOP NAV ===== */}
        <nav className={styles.menu}>
          <div className={styles.tabsContainer}>
            <div className={styles.tabs}>
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.tabLink} ${isActive(item.href) ? styles.active : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className={styles.right}>
            <Link
              href="/search"
              className={styles.searchBtn}
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <FiSearch />
            </Link>

            <a
              href="https://en.teatimetelugu.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.langBtn}
            >
              ENGLISH
            </a>

            {user ? (
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className={styles.logoutBtn}
                title="Logout"
              >
                <MdLogout />
              </button>
            ) : (
              <div className={styles.loginBtn} onClick={() => setIsJoin(true)} title="Login">
                <MdLogin />
                <span>Login</span>
              </div>
            )}
          </div>
        </nav>

        {/* ===== MOBILE HEADER ===== */}
        <div className={styles.mobileHeader}>
          <Link href="/">
            <Image
              src="/images/logo.jpg"
              alt="logo"
              width={120}
              height={60}
              className={styles.mobileLogo}
            />
          </Link>

          <div className={styles.mobileActions}>
            <Link
              href="/search"
              className={styles.mobileSearchBtn}
              aria-label="Search"
            >
              <FiSearch />
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={styles.mobileMenuBtn}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* ===== MOBILE MENU ===== */}
        <div
          className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ""}`}
        >
          <div className={styles.mobileMenuContent}>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.mobileLink} ${isActive(item.href) ? styles.active : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div className={styles.mobileBottomActions}>
              <a
                href="https://en.teatimetelugu.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mobileLangBtn}
              >
                English
              </a>

              {user ? (
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className={styles.mobileLogoutBtn}
                >
                  <MdLogout /> లాగ్ అవుట్
                </button>
              ) : (
                <Link
                  href="/login"
                  className={styles.mobileLoginBtn}
                  onClick={() => setMobileOpen(false)}
                >
                  <MdLogin /> లాగిన్
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {/* <div
          className={`${styles.mobileSearchOverlay} ${searchOpen ? styles.mobileSearchOpen : ""}`}
        >
          <form onSubmit={handleSearch} className={styles.mobileSearchForm}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="వ్యాసాలు వెతకండి..."
              className={styles.mobileSearchInput}
              autoFocus
            />
            <button type="submit" className={styles.mobileSearchButton}>
              <FiSearch />
            </button>
          </form>
        </div> */}
      </header>

      <AuthPopup
        open={isJoin}
        onClose={() => setIsJoin(false)}
        // pathname={window.location.pathname}
      />

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className={styles.logoutModal}>
          <div className={styles.logoutModalContent}>
            <p className={styles.logoutModalText}>
              మీరు ఖచ్చితంగా లాగ్ అవుట్ చేయాలనుకుంటున్నారా?
            </p>
            <div className={styles.logoutModalActions}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className={styles.logoutCancelBtn}
              >
                లేదు
              </button>
              <button
                onClick={handleLogout}
                className={styles.logoutConfirmBtn}
              >
                అవును
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
