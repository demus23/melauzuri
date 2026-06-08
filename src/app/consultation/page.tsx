import Shell from "@/components/Shell";
import Link from "next/link";
import styles from "./consultation.module.css";

const includes = [
  {
    title: "Skin concern review",
    desc: "Focused guidance for pigmentation, acne, ingrown hairs, sensitivity, and barrier damage.",
  },
  {
    title: "Routine assessment",
    desc: "Review of your current skincare steps to identify irritation triggers and unnecessary products.",
  },
  {
    title: "Melanin-safe recommendations",
    desc: "Practical advice designed for deeper skin tones with a barrier-first approach.",
  },
  {
    title: "Clear next steps",
    desc: "Simple AM/PM structure and realistic guidance for long-term skin improvement.",
  },
];

const concerns = [
  "Hyperpigmentation and dark marks",
  "Acne and post-acne marks",
  "Ingrown hairs and shaving irritation",
  "Barrier damage from over-exfoliation",
  "Sensitivity and product overload",
  "Uneven tone and routine confusion",
];

const steps = [
  {
    title: "Choose your consultation",
    desc: "Pick the consultation option that best matches your current skin needs.",
  },
  {
    title: "Submit your information",
    desc: "Share your skin concerns, history, and current routine for proper review.",
  },
  {
    title: "Receive your guidance",
    desc: "Get a structured plan with practical next steps and product logic.",
  },
];

export default function ConsultationPage() {
  return (
    <Shell>
      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroGlow} aria-hidden="true" />

          <div className={styles.left}>
            <div className={styles.badge}>
              Professional consultation • Melanin-safe • Barrier-first care
            </div>

            <h1 className={styles.h1}>
              Professional skincare consultation for melanin-rich skin.
            </h1>

            <p className={styles.p}>
              Personalized guidance for hyperpigmentation, acne, ingrown hairs,
              sensitivity, and skin barrier damage — designed to protect the
              skin and reduce unnecessary irritation.
            </p>

            <div className={styles.actions}>
              <Link href="/pricing" className={styles.primary}>
                View pricing
              </Link>
              <Link href="/register" className={styles.secondary}>
                Create account
              </Link>
            </div>

            <div className={styles.trustRow}>
              <span className={styles.trustItem}>Skin concern review</span>
              <span className={styles.dot}>•</span>
              <span className={styles.trustItem}>Routine clarity</span>
              <span className={styles.dot}>•</span>
              <span className={styles.trustItem}>Melanin-focused support</span>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Common concerns we help review</h3>
            <ul className={styles.list}>
              {concerns.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className={styles.cardActions}>
              <Link href="/pricing" className={styles.primarySmall}>
                Start now
              </Link>
              <Link href="/login" className={styles.link}>
                Already a member?
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.trustBar}>
          <div className={styles.trustInner}>
            <span>Melanin-focused skincare</span>
            <span>•</span>
            <span>Barrier-first protocols</span>
            <span>•</span>
            <span>Professional aesthetician guidance</span>
            <span>•</span>
            <span>Science-based routines</span>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.h2}>What your consultation includes</h2>
            <p className={styles.muted}>
              Clear support designed to simplify your skincare decisions.
            </p>
          </div>

          <div className={styles.grid4}>
            {includes.map((item) => (
              <div key={item.title} className={styles.featureCard}>
                <div className={styles.iconStub} />
                <h3 className={styles.h3}>{item.title}</h3>
                <p className={styles.muted}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.sectionAlt}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeadRow}>
              <div>
                <h2 className={styles.h2}>How the consultation works</h2>
                <p className={styles.muted}>
                  A simple path from booking to clear skincare direction.
                </p>
              </div>
              <Link href="/pricing" className={styles.pillLink}>
                See plans
              </Link>
            </div>

            <div className={styles.steps}>
              {steps.map((step, i) => (
                <div key={step.title} className={styles.stepCard}>
                  <div className={styles.stepTop}>
                    <div className={styles.stepNum}>{i + 1}</div>
                    <div className={styles.stepTitle}>{step.title}</div>
                  </div>
                  <p className={styles.muted}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.h2}>Who this is for</h2>
            <p className={styles.muted}>
              Ideal for people who want clarity, structure, and a safer routine.
            </p>
          </div>

          <div className={styles.grid3}>
            <div className={styles.featureCard}>
              <h3 className={styles.h3}>People dealing with dark marks</h3>
              <p className={styles.muted}>
                Recurring pigmentation, uneven tone, and post-acne marks that
                need a structured approach.
              </p>
            </div>

            <div className={styles.featureCard}>
              <h3 className={styles.h3}>Sensitive or reactive skin</h3>
              <p className={styles.muted}>
                Skin that becomes irritated easily from strong actives or too
                many products.
              </p>
            </div>

            <div className={styles.featureCard}>
              <h3 className={styles.h3}>People overwhelmed by skincare</h3>
              <p className={styles.muted}>
                Too much advice, too many products, and no clear routine that
                fits your actual skin condition.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.sectionAlt}>
          <div className={styles.expert}>
            <div className={styles.expertLeft}>
              <h2 className={styles.h2}>Guidance from a licensed aesthetician</h2>
              <p className={styles.muted}>
                MelaninCare combines professional skincare knowledge with
                practical routines designed specifically for deeper skin tones.
              </p>
              <p className={styles.muted}>
                The focus is on restoring the skin barrier, reducing
                inflammation, and building routines that work long-term.
              </p>
            </div>

            <div className={styles.expertCard}>
              <div className={styles.expertBadge}>Professional guidance</div>
              <div className={styles.expertName}>Rahwa</div>
              <div className={styles.expertTitle}>Licensed Aesthetician</div>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <div className={styles.ctaInner}>
            <div>
              <h2 className={styles.h2}>Start with clear skincare guidance</h2>
              <p className={styles.muted}>
                Choose your consultation path and begin with practical next
                steps.
              </p>
            </div>

            <div className={styles.ctaActions}>
              <Link href="/pricing" className={styles.primary}>
                View pricing
              </Link>
              <Link href="/register" className={styles.secondary}>
                Create account
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Shell>
  );
}