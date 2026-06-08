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

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");

  const navItems: NavItem[] = useMemo(
    () => [
      { href: "/pricing", label: "Pricing" },
      { href: "/courses", label: "Courses" },
      { href: "/consultation", label: "Consultations" },
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

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link className={styles.brand} href="/" aria-label="MelaninCare home">
            <span className={styles.logo} aria-hidden="true">
              <span className={styles.logoRing} />
              <span className={styles.logoDot} />
            </span>
            <span className={styles.brandText}>MelaninCare</span>
            <span className={styles.brandTag}>Courses · Consultations</span>
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
        <div className={styles.footerInner}>
          <div className={styles.footerLeft}>
            <div className={styles.footerBrand}>
              <span className={styles.footerMark} aria-hidden="true" />
              <div>
                <div className={styles.footerTitle}>MelaninCare</div>
                <div className={styles.footerMuted}>Melanin-safe education & consultations</div>
              </div>
            </div>

            <div className={styles.footerMeta}>
              <span className={styles.badge}>Darker-skin focused</span>
              <span className={styles.dot} aria-hidden="true" />
              <span className={styles.footerMuted}>
                Barrier-first, pigmentation-aware protocols
              </span>
            </div>
          </div>

          <div className={styles.footerRight}>
            <div className={styles.footerLinks}>
              <Link href="/terms" className={styles.footerLink}>Terms</Link>
              <Link href="/privacy" className={styles.footerLink}>Privacy</Link>
              <Link href="/support" className={styles.footerLink}>Support</Link>
            </div>
            <div className={styles.copy}>© {new Date().getFullYear()} MelaninCare</div>
          </div>
        </div>
      </footer>
    </div>
  );
}