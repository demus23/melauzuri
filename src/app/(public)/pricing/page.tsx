import Shell from "@/components/Shell";
import styles from "./pricing.module.css";
import Link from "next/link";

const plans = [
  {
    key: "course",
    title: "Course",
    price: 59,
    period: "one-time",
    desc: "Step-by-step melanin-safe routines for dark spots & acne marks.",
    items: [
      "Hyperpigmentation & acne education",
      "AM/PM routines + product guidance",
      "Common mistakes to avoid",
      "Lifetime access to course content",
    ],
    cta: "Get the course",
    primary: false,
  },
  {
    key: "bundle",
    title: "Bundle (Most Popular)",
    price: 99,
    period: "one-time",
    desc: "Course + consultation for a personalized plan and faster results.",
    items: [
      "Full course access included",
      "1 consultation intake + review",
      "Customized routine based on your skin",
      "Follow-up guidance after treatment",
    ],
    cta: "Get bundle",
    primary: true,
    badge: "Most Popular",
  },
  {
    key: "consultation",
    title: "Consultation",
    price: 70,
    period: "one-time",
    desc: "Personalized skincare plan for your concerns and products.",
    items: [
      "Skin assessment + history",
      "Routine tailored to your budget",
      "Product/ingredient guidance",
      "Next steps & timeline expectations",
    ],
    cta: "Book consultation",
    primary: false,
  },
];

export default function PricingPage() {
  return (
    <Shell>
      <div className={styles.header}>
        <h1 className={styles.h1}>Choose your plan</h1>
        <p className={styles.sub}>
          Simple, melanin-safe guidance designed to help with hyperpigmentation,
          acne, ingrowns, and barrier repair — without harsh routines.
        </p>
      </div>

      <div className={styles.grid}>
        {plans.map((p) => (
          <div key={p.key} className={styles.card}>
            {p.badge && <div className={styles.badge}>{p.badge}</div>}

            <h3 className={styles.title}>{p.title}</h3>

            <div className={styles.priceRow}>
              <div className={styles.price}>${p.price}</div>
              <div className={styles.period}>{p.period}</div>
            </div>

            <p className={styles.desc}>{p.desc}</p>

            <ul className={styles.list}>
              {p.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>

            <Link
              className={`${styles.cta} ${p.primary ? styles.ctaPrimary : ""}`}
              href={`/checkout/manual?product=${p.key}`}
            >
              {p.cta}
            </Link>
          </div>
        ))}
      </div>

      <p className={styles.note}>
        Payments are currently approved manually (Wise transfer). After payment,
        upload proof and we activate access.
      </p>
    </Shell>
  );
}
