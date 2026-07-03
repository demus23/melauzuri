"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Shell from "@/components/Shell";

/* ────────────────────────────────────────────────────────────
   MelaninCare homepage — v2, rebuilt to an 8-section structure:
   Hero / How it works / Common concerns / Pricing / Featured
   courses / Meet the experts / Testimonials / Footer.
   No CSS modules, no Tailwind dependency — every style is
   inline or scoped via the mc- prefixed <style> tag below.
   ──────────────────────────────────────────────────────────── */

const COLORS = {
  amber: "#C8733A",
  amberLight: "#E8A56A",
  amberPale: "#FAF0E6",
  amberWarm: "#F5DFC0",
  deep: "#2A1A0E",
  mid: "#5C3D22",
  muted: "#8B6B4A",
  cream: "#FDF8F3",
  border: "rgba(200,115,58,0.15)",
  mint: "#2EAA7E",
};

/* ── content ── */

const howItWorks = [
  { title: "Choose your plan", desc: "Select a course, consultation, or bundle based on your needs." },
  { title: "Complete payment", desc: "Pay securely, then submit proof if manual approval is required." },
  { title: "Receive your guidance", desc: "Get access to your course or personalized consultation pathway." },
];

const concerns = [
  "Acne & breakouts",
  "Hyperpigmentation & dark spots",
  "Melasma support & management",
  "Sensitive & reactive skin",
  "Dry, dehydrated & compromised skin",
  "Oily & congested skin",
  "Reclaiming your natural skin tone after whitening cream damage",
  "Skin barrier repair & recovery",
  "Healthy aging & graceful skin aging management",
  "Overall skin health, education & long-term care",
];

const featuredCourses = [
  {
    tag: "By Rahwa",
    title: "Understanding Your Skin",
    desc: "The foundational course — skin type, barrier health, and building a routine that lasts.",
  },
  {
    tag: "Dermatologist",
    title: "Pigmentation & Melasma",
    desc: "Clinical guidance on persistent pigmentation, melasma triggers, and safe treatment paths.",
  },
  {
    tag: "Nutritionist",
    title: "Nutrition for Skin Health",
    desc: "How diet, hydration, and inflammation connect to acne, aging, and overall skin condition.",
  },
];

const testimonials = [
  { quote: "My routine finally stopped the cycle of irritation and dark marks.", name: "Verified client" },
  { quote: "Understanding my skin barrier changed everything for me.", name: "Verified client" },
];

export default function HomePage() {
  const revealRefs = useRef<(HTMLDivElement | null)[]>([]);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!heroVideoRef.current) return;
    if (reducedMotion) {
      heroVideoRef.current.pause();
    } else {
      heroVideoRef.current.play().catch(() => {
        /* autoplay can be blocked by the browser — poster image remains visible */
      });
    }
  }, [reducedMotion]);

  useEffect(() => {
    const els = revealRefs.current.filter(Boolean) as HTMLDivElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-visible", "true");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  let revealIndex = 0;
  const reveal = (el: HTMLDivElement | null) => {
    revealRefs.current[revealIndex++] = el;
  };

  return (
    <Shell>
      <div style={{ fontFamily: "'Inter', sans-serif", background: COLORS.cream, color: COLORS.deep, overflowX: "hidden", margin: "-22px -18px 0", padding: "0" }}>
        <GlobalStyle />

      {/* 1 — HERO */}
      <section style={{ position: "relative", padding: "72px 40px 64px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center", overflow: "hidden", minHeight: 560 }} className="mc-hero">
        <div aria-hidden="true" className="mc-orb mc-orb1" />

        <div style={{ position: "relative", zIndex: 2 }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 50, lineHeight: 1.1, letterSpacing: "-0.03em", color: COLORS.deep, margin: "0 0 18px", maxWidth: "16ch" }} className="mc-h1">
            Understand your skin. Care for it with confidence.
          </h1>

          <p style={{ fontSize: 16, lineHeight: 1.75, color: COLORS.muted, maxWidth: "44ch", margin: "0 0 32px" }}>
            Evidence-based skin education and personalized guidance from beauty therapists and healthcare professionals.
          </p>

          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <Link href="/pricing" style={btnLgStyle}>View plans →</Link>
            <Link href="/courses" style={btnLgGhostStyle}>See courses</Link>
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 2 }}>
          {/*
            HERO VIDEO
            Subject: a specialist gently treating a client's face (facial/skin treatment in motion).
            Autoplay, muted, looped — no sound needed, just ambient motion.
            No poster image yet — the amber background shows briefly while the video loads.
            Add poster="/images/hero-poster.jpg" back in once that still is exported.
          */}
          <video
            ref={heroVideoRef}
            autoPlay={!reducedMotion}
            muted
            loop={!reducedMotion}
            playsInline
            preload="metadata"
            aria-label="A specialist gently treating a client's face during a skincare session"
            style={{
              width: "100%",
              aspectRatio: "4 / 5",
              borderRadius: 28,
              objectFit: "cover",
              border: `1px solid ${COLORS.border}`,
              boxShadow: "0 20px 60px rgba(42,26,14,0.1)",
              display: "block",
              background: COLORS.amberPale,
            }}
          >
            <source src="/images/hero-treatment.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      {/* 2 — HOW MELANINCARE WORKS */}
      <section style={{ padding: "80px 40px", background: "#fff" }}>
        <div ref={reveal} className="mc-reveal" style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 52px" }}>
          <div style={eyebrowTextStyle}>Process</div>
          <h2 style={h2Style}>How MelaninCare works</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="mc-steps">
          {howItWorks.map((s, i) => (
            <div key={s.title} ref={reveal} className="mc-reveal" style={{ background: COLORS.amberPale, border: `1px solid ${COLORS.border}`, borderRadius: 22, padding: "26px 22px", textAlign: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: COLORS.deep, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Serif Display', serif", fontSize: 17, margin: "0 auto 16px" }}>
                {i + 1}
              </div>
              <div style={{ fontWeight: 600, fontSize: 16, color: COLORS.deep, margin: "0 0 6px" }}>{s.title}</div>
              <p style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Learn / Consult / Improve image cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 40 }} className="mc-learn-grid">
          {[
            { label: "Learn", desc: "Skin education courses designed by professionals.", src: "/images/learn-photo.jpg", alt: "Laptop displaying an online skin education course" },
            { label: "Consult", desc: "Personalized skin guidance for your unique concerns.", src: "/images/consult-photo.jpg", alt: "A specialist consulting with a client about her skin" },
            { label: "Improve", desc: "Build sustainable habits for long-term skin health.", src: "/images/improve-photo.jpg", alt: "Close-up of healthy, glowing skin" },
          ].map((c) => (
            <div key={c.label} ref={reveal} className="mc-reveal" style={{ borderRadius: 22, overflow: "hidden", border: `1px solid ${COLORS.border}` }}>
              <img src={c.src} alt={c.alt} style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover", display: "block" }} />
              <div style={{ padding: "18px 18px 22px" }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: COLORS.deep, margin: "0 0 6px" }}>{c.label}</div>
                <p style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3 — COMMON CONCERNS WE SUPPORT */}
      <section style={{ padding: "80px 40px" }}>
        <div ref={reveal} className="mc-reveal" style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 44px" }}>
          <div style={eyebrowTextStyle}>What we treat</div>
          <h2 style={h2Style}>Common skin concerns we support</h2>
        </div>

        <div ref={reveal} className="mc-reveal" style={{ maxWidth: 760, margin: "0 auto", background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 24, padding: "12px 8px", boxShadow: "0 4px 24px rgba(42,26,14,0.05)" }}>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }} className="mc-concerns-grid">
            {concerns.map((c) => (
              <li key={c} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: COLORS.mid, fontWeight: 500, padding: "12px 16px", lineHeight: 1.5 }}>
                <span style={{ color: COLORS.amber, fontWeight: 700, flexShrink: 0 }}>✓</span>
                {c}
              </li>
            ))}
          </ul>
        </div>

        {/* Educational explainer diagrams — replaces before/after photography.
            No outcome claims; illustrative only. */}
        <div ref={reveal} className="mc-reveal" style={{ maxWidth: 900, margin: "52px auto 0", textAlign: "center" }}>
          <p style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.6, maxWidth: "58ch", margin: "0 auto" }}>
            Results vary by individual. Our focus is long-term skin health, education, and evidence-based care.
          </p>
        </div>
      </section>

      {/* 4 — PRICING */}
      <section style={{ padding: "80px 40px", background: "#fff" }}>
        <div ref={reveal} className="mc-reveal" style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 52px" }}>
          <div style={eyebrowTextStyle}>Pricing</div>
          <h2 style={h2Style}>Choose your plan</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1.1fr", gap: 16, alignItems: "start" }} className="mc-pricing-grid">
          {/* Skin Consultation */}
          <PriceCard
            reveal={reveal}
            badge="Consultation"
            title="Skin Consultation"
            price="USD 50"
            sub="one-time"
            items={[
              "Personalized skin assessment",
              "Skincare routine guidance",
              "Product recommendations",
              "Lifestyle and skin health review",
            ]}
            ctaHref="/checkout/manual?product=consultation"
            ctaLabel="Book consultation"
          />

          {/* Dermatologist-Assisted */}
          <PriceCard
            reveal={reveal}
            badge="Dermatologist-assisted"
            title="Dermatologist-Assisted Consultation"
            price="USD 100"
            sub="USD 50 consultation + USD 50 dermatologist review"
            items={[
              "Complex skin concerns",
              "Persistent acne",
              "Pigmentation disorders",
              "Cases requiring dermatologist input",
            ]}
            ctaHref="/checkout/manual?product=consultation-derm"
            ctaLabel="Book with dermatologist"
          />

          {/* Skin Education Course */}
          <PriceCard
            reveal={reveal}
            badge="Course"
            title="Skin Education Course"
            price="USD 59"
            sub="one-time"
            items={[
              "Self-paced learning",
              "Understanding your skin",
              "Building effective routines",
              "Product literacy",
            ]}
            ctaHref="/checkout/manual?product=course"
            ctaLabel="Get the course"
          />

          {/* Bundle — featured */}
          <div ref={reveal} className="mc-reveal" style={{ background: COLORS.deep, borderRadius: 24, padding: "28px 24px", boxShadow: "0 20px 56px rgba(42,26,14,0.22)", transform: "scale(1.02)" }}>
            <PriceBadge>⭐ Best value</PriceBadge>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 21, color: "#fff", margin: "0 0 6px" }}>Complete Skin Transformation Bundle</div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 40, lineHeight: 1, color: COLORS.amberLight, margin: "8px 0 4px" }}>USD 129</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.45)", margin: "0 0 20px" }}>one-time</div>
            <div style={{ height: 1, background: "rgba(255,255,255,0.1)", margin: "16px 0" }} />
            <PriceFeatureList items={["Full consultation", "Dermatologist review if needed", "Course access", "Personalized action plan"]} />
            <Link href="/checkout/manual?product=bundle" style={btnPricePrimaryStyle}>Get the bundle</Link>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginTop: 28 }}>
          {["Licensed aesthetician", "Dermatologist-reviewed", "Secure payment"].map((t) => (
            <span
              key={t}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 700,
                color: COLORS.muted,
                padding: "6px 12px",
                borderRadius: 999,
                background: "rgba(46,170,126,0.08)",
                border: "1px solid rgba(46,170,126,0.18)",
              }}
            >
              <span style={{ color: "#1C7A57", fontWeight: 800 }}>✓</span>
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* 5 — FEATURED COURSES */}
      <section style={{ padding: "80px 40px" }}>
        <div ref={reveal} className="mc-reveal" style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 52px" }}>
          <div style={eyebrowTextStyle}>Learn</div>
          <h2 style={h2Style}>Featured courses</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="mc-courses-grid">
          {featuredCourses.map((c) => (
            <div key={c.title} ref={reveal} className="mc-reveal" style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 22, padding: "24px 22px" }}>
              <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: COLORS.amber, background: COLORS.amberPale, border: "1px solid rgba(200,115,58,0.2)", borderRadius: 999, padding: "4px 10px", marginBottom: 14 }}>
                {c.tag}
              </div>
              <div style={{ fontWeight: 600, fontSize: 17, color: COLORS.deep, margin: "0 0 8px" }}>{c.title}</div>
              <p style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.6, margin: "0 0 16px" }}>{c.desc}</p>
              <Link href="/courses" style={{ fontSize: 13, fontWeight: 600, color: COLORS.amber, textDecoration: "none" }}>View course →</Link>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Link href="/courses" style={btnLgGhostStyle}>Browse all courses</Link>
        </div>
      </section>

      {/* 6 — MEET THE EXPERTS */}
      <section style={{ padding: "80px 40px", background: "#fff" }}>
        <div ref={reveal} className="mc-reveal" style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 52px" }}>
          <div style={eyebrowTextStyle}>Meet the experts</div>
          <h2 style={h2Style}>Guidance from licensed professionals</h2>
        </div>

        <div ref={reveal} className="mc-reveal mc-expert-card" style={{ maxWidth: 640, margin: "0 auto", background: COLORS.deep, borderRadius: 28, padding: 32, color: "#fff", boxShadow: "0 20px 60px rgba(42,26,14,0.2)", display: "flex", gap: 24, alignItems: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.amber}, ${COLORS.amberLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Serif Display', serif", fontSize: 28, color: "#fff", flexShrink: 0 }}>R</div>
          <div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: "#fff", margin: "0 0 4px" }}>Rahwa</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>Licensed Aesthetician · Melanin Specialist</div>
          </div>
        </div>
      </section>

      {/* 7 — TESTIMONIALS */}
      <section style={{ padding: "80px 40px" }}>
        <div ref={reveal} className="mc-reveal" style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 44px" }}>
          <div style={eyebrowTextStyle}>Client results</div>
          <h2 style={h2Style}>What clients say</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, maxWidth: 760, margin: "0 auto" }} className="mc-quotes-grid">
          {testimonials.map((t, i) => (
            <div key={i} ref={reveal} className="mc-reveal" style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: "22px 20px" }}>
              <p style={{ fontSize: 14, color: COLORS.mid, lineHeight: 1.65, margin: "0 0 14px" }}>"{t.quote}"</p>
              <p style={{ fontWeight: 600, fontSize: 13, color: COLORS.deep, margin: 0 }}>{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DISCLAIMER */}
      <div style={{ background: COLORS.deep, padding: "18px 40px", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0 }}>
          Educational content only — not a substitute for in-person dermatological care.
        </p>
      </div>
      </div>
    </Shell>
  );
}

/* ── small subcomponents ── */

function PriceCard({
  reveal,
  badge,
  title,
  price,
  sub,
  items,
  ctaHref,
  ctaLabel,
}: {
  reveal: (el: HTMLDivElement | null) => void;
  badge: string;
  title: string;
  price: string;
  sub: string;
  items: string[];
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <div ref={reveal} className="mc-reveal" style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 24, padding: "26px 22px" }}>
      <PriceBadge dark>{badge}</PriceBadge>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 19, color: COLORS.deep, margin: "0 0 8px", lineHeight: 1.25 }}>{title}</div>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, lineHeight: 1, color: COLORS.deep, margin: "0 0 4px" }}>{price}</div>
      <div style={{ fontSize: 12, fontWeight: 500, color: COLORS.muted, margin: "0 0 18px", lineHeight: 1.5 }}>{sub}</div>
      <div style={{ height: 1, background: COLORS.border, margin: "14px 0" }} />
      <PriceFeatureList dark items={items} />
      <Link href={ctaHref} style={btnPriceGhostStyle}>{ctaLabel}</Link>
    </div>
  );
}

function PriceBadge({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "5px 12px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        marginBottom: 14,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        background: dark ? COLORS.amberPale : "rgba(200,115,58,0.18)",
        color: dark ? COLORS.amber : COLORS.amberLight,
      }}
    >
      {children}
    </div>
  );
}

function PriceFeatureList({ items, dark }: { items: string[]; dark?: boolean }) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: "0 0 22px", display: "flex", flexDirection: "column", gap: 9 }}>
      {items.map((f) => (
        <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12.5, lineHeight: 1.45, color: dark ? COLORS.mid : "rgba(255,255,255,0.8)", fontWeight: 500 }}>
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 8,
              flexShrink: 0,
              marginTop: 2,
              background: dark ? COLORS.amberPale : "rgba(200,115,58,0.2)",
              color: dark ? COLORS.amber : COLORS.amberLight,
            }}
          >
            ✓
          </span>
          {f}
        </li>
      ))}
    </ul>
  );
}

/* ── shared inline style objects ── */

const btnLgStyle: React.CSSProperties = {
  padding: "14px 28px",
  borderRadius: 999,
  fontSize: 15,
  fontWeight: 600,
  background: COLORS.amber,
  color: "#fff",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  boxShadow: "0 8px 28px rgba(200,115,58,0.35)",
};

const btnLgGhostStyle: React.CSSProperties = {
  padding: "14px 28px",
  borderRadius: 999,
  fontSize: 15,
  fontWeight: 500,
  background: "transparent",
  color: COLORS.mid,
  border: "1.5px solid rgba(200,115,58,0.3)",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
};

const btnPriceGhostStyle: React.CSSProperties = {
  width: "100%",
  padding: 12,
  borderRadius: 999,
  background: "transparent",
  color: COLORS.mid,
  border: `1px solid ${COLORS.border}`,
  fontWeight: 600,
  fontSize: 13,
  textAlign: "center",
  textDecoration: "none",
  display: "block",
};

const btnPricePrimaryStyle: React.CSSProperties = {
  width: "100%",
  padding: 12,
  borderRadius: 999,
  background: COLORS.amber,
  color: "#fff",
  fontWeight: 600,
  fontSize: 13,
  textAlign: "center",
  textDecoration: "none",
  display: "block",
  boxShadow: "0 6px 20px rgba(200,115,58,0.3)",
};

const eyebrowTextStyle: React.CSSProperties = {
  display: "inline-block",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: COLORS.amber,
  marginBottom: 12,
};

const h2Style: React.CSSProperties = {
  fontFamily: "'DM Serif Display', serif",
  fontSize: 36,
  lineHeight: 1.15,
  letterSpacing: "-0.02em",
  color: COLORS.deep,
  margin: 0,
};

/* ── global style tag ── */

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600&display=swap');

      .mc-orb {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
        animation: mc-pulse 6s ease-in-out infinite;
      }
      .mc-orb1 {
        width: 480px; height: 480px;
        background: radial-gradient(circle, rgba(200,115,58,0.14), transparent 70%);
        top: -120px; left: -100px;
      }

      .mc-reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.55s ease, transform 0.55s ease; }
      .mc-reveal[data-visible="true"] { opacity: 1; transform: translateY(0); }

      .mc-footer-link { transition: color 0.2s; }
      .mc-footer-link:hover { color: #fff !important; }

      @keyframes mc-pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.08); opacity: 0.7; } }

      @media (max-width: 980px) {
        .mc-hero { grid-template-columns: 1fr !important; }
        .mc-h1 { font-size: 40px !important; max-width: none !important; }
        .mc-steps { grid-template-columns: 1fr !important; }
        .mc-learn-grid { grid-template-columns: 1fr !important; }
        .mc-concerns-grid { grid-template-columns: 1fr !important; }
        .mc-pricing-grid { grid-template-columns: 1fr 1fr !important; }
        .mc-courses-grid { grid-template-columns: 1fr !important; }
        .mc-quotes-grid { grid-template-columns: 1fr !important; }
        .mc-footer-grid { grid-template-columns: 1fr 1fr !important; }
        .mc-expert-card { flex-direction: column !important; text-align: center; }
      }
      @media (max-width: 640px) {
        .mc-pricing-grid { grid-template-columns: 1fr !important; }
        .mc-footer-grid { grid-template-columns: 1fr !important; }
      }
    `}</style>
  );
}