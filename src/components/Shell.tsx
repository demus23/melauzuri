"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./shell.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string };
type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem("mc_theme");
  if (saved === "light" || saved === "dark") return saved;

  const prefersDark =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

  return prefersDark ? "dark" : "light";
}

const footerColumns = [
  {
    heading: "Explore",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Courses", href: "/courses" },
      { label: "Consultations", href: "/consultations" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Rahwa", href: "/about" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
      { label: "Support", href: "/support" },
    ],
  },
];

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com", glyph: "IG" },
  { label: "TikTok", href: "https://tiktok.com", glyph: "TT" },
  { label: "Email", href: "mailto:hello@melazuri.com", glyph: "@" },
];

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const navItems: NavItem[] = useMemo(
    () => [
      { href: "/pricing", label: "Pricing" },
      { href: "/courses", label: "Courses" },
      { href: "/consultations", label: "Consultations" },
      { href: "/support", label: "Support" },
    ],
    []
  );

  useEffect(() => setTheme(getInitialTheme()), []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("mc_theme", theme);
  }, [theme]);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  function handleNewsletterSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: wire to actual newsletter provider / API route.
    setSubscribed(true);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link className={styles.brand} href="/" aria-label="Melazuri home">
            <span className={styles.logo} aria-hidden="true">
              <span className={styles.logoRing} />
              <span className={styles.logoDot} />
            </span>
            <span className={styles.brandText}>Melazuri</span>
          </Link>

          <nav className={styles.nav} aria-label="Primary">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isActive(item.href) ? styles.navLinkActive : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.themeBtn}
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              <span
                className={`${styles.themeIcon} ${theme === "dark" ? styles.moon : styles.sun}`}
                aria-hidden="true"
              />
              <span className={styles.themeText}>
                {theme === "dark" ? "Dark" : "Light"}
              </span>
            </button>

            <Link href="/login" className={styles.ghost}>Log in</Link>
            <Link href="/register" className={styles.primary}>Create account</Link>

            <button
              type="button"
              className={styles.menuBtn}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span className={styles.menuIcon} aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>

        <div className={`${styles.mobilePanel} ${open ? styles.mobilePanelOpen : ""}`}>
          <div className={styles.mobileInner}>
            <div className={styles.mobileNav} aria-label="Mobile primary">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.mobileLink} ${isActive(item.href) ? styles.mobileLinkActive : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className={styles.mobileCtas}>
              <Link href="/login" className={styles.mobileGhost}>Log in</Link>
              <Link href="/register" className={styles.mobilePrimary}>Create account</Link>
            </div>

            <div className={styles.mobileHint}>
              Melanin-safe education & consultations for deeper skin tones.
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.container}>{children}</div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          {/* Brand + social + newsletter */}
          <div className={styles.footerBrandCol}>
            <div className={styles.footerBrand}>
              <span className={styles.footerMark} aria-hidden="true" />
              <div className={styles.footerTitle}>Melazuri</div>
            </div>
            <p className={styles.footerDesc}>
              Melanin-safe skincare education and consultations, built by a licensed
              aesthetician and a network of specialists for deeper skin tones.
            </p>

            <div className={styles.socialRow} aria-label="Social links">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className={styles.socialLink}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {s.glyph}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.heading} className={styles.footerCol}>
              <div className={styles.footerColHeading}>{col.heading}</div>
              <ul className={styles.footerColList}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className={styles.footerLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className={styles.footerCol}>
            <div className={styles.footerColHeading}>Stay updated</div>
            <p className={styles.footerDesc}>
              New courses, specialists, and skin-health guidance — occasionally, never spam.
            </p>
            {subscribed ? (
              <p className={styles.newsletterSuccess}>You're on the list — thank you.</p>
            ) : (
              <form className={styles.newsletterForm} onSubmit={handleNewsletterSubmit}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  aria-label="Email address"
                  className={styles.newsletterInput}
                />
                <button type="submit" className={styles.newsletterBtn}>
                  Join the list
                </button>
              </form>
            )}
          </div>
        </div>

        <div className={styles.footerMetaRow}>
          <div className={styles.footerMeta}>
            <span className={styles.badge}>Darker-skin focused</span>
            <span className={styles.dot} aria-hidden="true" />
            <span className={styles.footerMuted}>
              Barrier-first, pigmentation-aware protocols
            </span>
          </div>
          <div className={styles.copy}>© {new Date().getFullYear()} Melazuri. All rights reserved.</div>
        </div>

        <div className={styles.footerDisclaimer}>
          Educational content only — not a substitute for in-person dermatological care.
        </div>
      </footer>
    </div>
  );
}