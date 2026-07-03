"use client";

import { useState } from "react";
import Shell from "@/components/Shell";
import styles from "./pricing.module.css";
import Link from "next/link";

const plans = [
  {
    key: "consultation",
    title: "Skin Consultation",
    price: 50,
    period: "one-time",
    desc: "Personalized skin assessment and routine guidance for your concerns.",
    items: [
      "Personalized skin assessment",
      "Skincare routine guidance",
      "Product recommendations",
      "Lifestyle and skin health review",
    ],
    cta: "Book consultation",
    primary: false,
  },
  {
    key: "bundle",
    title: "Complete Skin Transformation Bundle",
    price: 129,
    period: "one-time",
    priceSub: "Best value",
    desc: "Full consultation, dermatologist review if needed, and course access.",
    items: [
      "Full consultation",
      "Dermatologist review if needed",
      "Course access",
      "Personalized action plan",
    ],
    cta: "Get the bundle",
    primary: true,
    badge: "Best Value",
  },
  {
    key: "consultation-derm",
    title: "Dermatologist-Assisted Consultation",
    price: 100,
    period: "one-time",
    priceSub: "USD 50 consultation + USD50 dermatologist review",
    desc: "For complex skin concerns that need dermatologist input.",
    items: [
      "Complex skin concerns",
      "Persistent acne",
      "Pigmentation disorders",
      "Cases requiring dermatologist input",
    ],
    cta: "Book with dermatologist",
    primary: false,
  },
  {
    key: "course",
    title: "Skin Education Course",
    price: 59,
    period: "one-time",
    desc: "Self-paced learning to understand your skin and build effective routines.",
    items: [
      "Self-paced learning",
      "Understanding your skin",
      "Building effective routines",
      "Product literacy",
    ],
    cta: "Get the course",
    primary: false,
  },
];

const faqs = [
  {
    q: "Is this safe for my skin tone?",
    a: "Yes — Melazuri is built specifically around deeper skin tones. Our guidance, courses, and consultations account for how conditions like hyperpigmentation, melasma, and barrier damage from whitening creams present and respond to treatment in melanin-rich skin, not generic skincare advice.",
  },
  {
    q: "What happens after I pay?",
    a: "You'll get access to your dashboard right away. For consultations, you'll complete a short questionnaire and upload a few photos, then your case goes to Rahwa or the relevant specialist for review. For courses, content unlocks immediately.",
  },
  {
    q: "How fast do I hear back?",
    a: "Most consultations are reviewed within 48 hours. If your case needs a dermatologist's input, that review may take a little longer — we'll keep you updated in your consultation status page throughout.",
  },
  {
    q: "What's the difference between the two consultation options?",
    a: "The Skin Consultation covers personalized assessment and routine guidance for most concerns. The Dermatologist-Assisted option adds a dermatologist's review on top, which we recommend for persistent acne, pigmentation disorders, or any case that needs clinical input beyond routine guidance.",
  },
  {
    q: "Can I switch from a consultation to the bundle later?",
    a: "Yes. If you've already booked a Skin Consultation and want full course access too, reach out through Support and we'll apply your consultation toward the Bundle price.",
  },
  {
    q: "How do I pay?",
    a: "You can pay by credit/debit card (Stripe), UAE bank transfer, international bank transfer (Wise), or another method by contacting support directly. For manual methods, upload your payment proof afterward and we activate your access — usually within a few hours.",
  },
];

const paymentMethods = [
  { label: "Credit/Debit Card (Stripe)", icon: "💳" },
  { label: "UAE Bank Transfer", icon: "🏦" },
  { label: "International Bank Transfer (Wise)", icon: "🌍" },
  { label: "Other Payment Method (contact support)", icon: "💬" },
];

const trustBadges = [
  { label: "Licensed aesthetician", icon: "✓" },
  { label: "Dermatologist-reviewed", icon: "✓" },
  { label: "Secure payment", icon: "✓" },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.faqItem}>
      <button
        type="button"
        className={styles.faqQuestion}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{q}</span>
        <span className={`${styles.faqIcon} ${open ? styles.faqIconOpen : ""}`} aria-hidden="true">
          +
        </span>
      </button>
      <div className={`${styles.faqAnswer} ${open ? styles.faqAnswerOpen : ""}`}>
        <div className={styles.faqAnswerInner}>
          <p className={styles.faqAnswerText}>{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Shell>
      <div className={styles.header}>
        <h1 className={styles.h1}>Choose your plan</h1>
        <p className={styles.sub}>
          Simple, melanin-safe guidance designed to help with hyperpigmentation,
          melasma, acne, and barrier repair — without harsh routines.
        </p>
      </div>

      <div className={styles.grid}>
        {plans.map((p) => (
          <div key={p.key} className={styles.card}>
            {p.badge && <div className={styles.badge}>{p.badge}</div>}

            <h3 className={styles.title}>{p.title}</h3>

            <div className={styles.priceRow}>
              <div className={styles.price}>USD {p.price}</div>
              <div className={styles.period}>{p.period}</div>
            </div>
            {p.priceSub && <p className={styles.priceSub}>{p.priceSub}</p>}

            <p className={styles.desc}>{p.desc}</p>

            <ul className={styles.list}>
              {p.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>

            <Link className={styles.cta} href={`/checkout/manual?product=${p.key}`}>
              {p.cta}
            </Link>

            <div className={styles.trustRow}>
              {trustBadges.map((t) => (
                <span key={t.label} className={styles.trustBadge}>
                  <span className={styles.trustIcon} aria-hidden="true">{t.icon}</span>
                  {t.label}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <section className={styles.paymentSection}>
        <div className={styles.paymentHeader}>
          <h2 className={styles.faqH2}>Payment methods</h2>
          <p className={styles.faqSub}>
            Choose whichever option works best for you. After payment, upload proof and we activate your access.
          </p>
        </div>

        <div className={styles.paymentGrid}>
          {paymentMethods.map((m) => (
            <div key={m.label} className={styles.paymentCard}>
              <span className={styles.paymentIcon} aria-hidden="true">{m.icon}</span>
              <span className={styles.paymentLabel}>{m.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.faqSection}>
        <div className={styles.faqHeader}>
          <h2 className={styles.faqH2}>Frequently asked questions</h2>
          <p className={styles.faqSub}>
            Everything you need to know before booking.
          </p>
        </div>

        <div className={styles.faqList}>
          {faqs.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>
    </Shell>
  );
}