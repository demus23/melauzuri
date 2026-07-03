import Shell from "@/components/Shell";
import Link from "next/link";
import styles from "./home.module.css";

const features = [
  {
    title: "Melanin-safe routines",
    desc: "Barrier-first plans designed to reduce irritation, inflammation, and rebound darkening.",
  },
  {
    title: "Science-based guidance",
    desc: "Clear skincare principles for pigmentation, acne, sensitivity, and long-term skin health.",
  },
  {
    title: "Professional consultations",
    desc: "Structured support with practical next steps, product logic, and follow-up direction.",
  },
  {
    title: "Simple daily structure",
    desc: "AM/PM routines built to be realistic, consistent, and easy to follow in real life.",
  },
];

const steps = [
  {
    title: "Choose your plan",
    desc: "Select a course, consultation, or bundle based on your current needs.",
  },
  {
    title: "Complete payment",
    desc: "Pay securely, then submit proof if manual approval is required.",
  },
  {
    title: "Receive your guidance",
    desc: "Get access to your course or your personalized consultation pathway.",
  },
];

const testimonials = [
  {
    name: "Client A",
    text: "My routine finally stopped the cycle of irritation and dark marks. It felt clear from day one.",
  },
  {
    name: "Client B",
    text: "The biggest change was understanding my skin barrier. My skin became calmer and more even.",
  },
  {
    name: "Client C",
    text: "Everything felt professional and simple. I knew what to use, what to stop, and what to expect.",
  },
];

export default function HomePage() {
  return (
    <Shell>
      <div className={styles.page}>
        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.heroGlow} aria-hidden="true" />
          <div className={styles.left}>
            <div className={styles.badge}>
              Clinical guidance • Melanin-safe • Barrier-first care
            </div>

            <h1 className={styles.h1}>
              Trusted skincare education and consultations for melanin-rich skin.
            </h1>

            <p className={styles.p}>
              Clear support for hyperpigmentation, acne, ingrown hairs, sensitivity, and barrier damage —
              designed to protect the skin, reduce irritation, and improve long-term results.
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
              <span className={styles.trustItem}>AM / PM routine clarity</span>
              <span className={styles.dot}>•</span>
              <span className={styles.trustItem}>Professional consultation flow</span>
              <span className={styles.dot}>•</span>
              <span className={styles.trustItem}>Melanin-focused education</span>
            </div>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <div className={styles.statNum}>AM / PM</div>
                <div className={styles.statLabel}>simple routines with better structure</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNum}>Barrier-first</div>
                <div className={styles.statLabel}>reduce irritation before chasing results</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNum}>Melanin-safe</div>
                <div className={styles.statLabel}>education built for deeper skin tones</div>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Most common concerns we help with</h3>
            <ul className={styles.list}>
              <li>Dark spots and uneven skin tone</li>
              <li>Acne and post-acne marks</li>
              <li>Ingrown hairs and shaving irritation</li>
              <li>Barrier damage from over-exfoliation or bleaching</li>
              <li>Sensitivity, redness, and product overload</li>
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

        {/* TRUST BAR */}
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

        {/* FEATURES */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.h2}>A premium experience without the confusion</h2>
            <p className={styles.muted}>
              Professional guidance should feel calm, clear, and easy to follow.
            </p>
          </div>

          <div className={styles.grid4}>
            {features.map((f) => (
              <div key={f.title} className={styles.featureCard}>
                <div className={styles.iconStub} />
                <h3 className={styles.h3}>{f.title}</h3>
                <p className={styles.muted}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* WHO THIS IS FOR */}
<section className={styles.section}>
  <div className={styles.sectionHead}>
    <h2 className={styles.h2}>Designed for real skin concerns</h2>
    <p className={styles.muted}>
      Practical guidance for people who struggle with recurring skin issues.
    </p>
  </div>

  <div className={styles.grid3}>
    <div className={styles.featureCard}>
      <h3 className={styles.h3}>People dealing with hyperpigmentation</h3>
      <p className={styles.muted}>
        Dark spots, uneven tone, and post-acne marks that keep coming back.
      </p>
    </div>

    <div className={styles.featureCard}>
      <h3 className={styles.h3}>Sensitive or reactive skin</h3>
      <p className={styles.muted}>
        Skin that becomes irritated easily from over-exfoliation or harsh routines.
      </p>
    </div>

    <div className={styles.featureCard}>
      <h3 className={styles.h3}>People overwhelmed by skincare products</h3>
      <p className={styles.muted}>
        Too many products and conflicting advice creating confusion and irritation.
      </p>
    </div>
  </div>
</section>

        {/* HOW IT WORKS */}
        <section className={styles.sectionAlt}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeadRow}>
              <div>
                <h2 className={styles.h2}>How it works</h2>
                <p className={styles.muted}>
                  A smooth path from access to action.
                </p>
              </div>
              <Link href="/pricing" className={styles.pillLink}>
                See plans
              </Link>
            </div>

            <div className={styles.steps}>
              {steps.map((s, i) => (
                <div key={s.title} className={styles.stepCard}>
                  <div className={styles.stepTop}>
                    <div className={styles.stepNum}>{i + 1}</div>
                    <div className={styles.stepTitle}>{s.title}</div>
                  </div>
                  <p className={styles.muted}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EXPERT */}
<section className={styles.sectionAlt}>
  <div className={styles.expert}>
    <div className={styles.expertLeft}>
      <h2 className={styles.h2}>Guidance from a licensed aesthetician</h2>
      <p className={styles.muted}>
        Melazuricombines professional skincare knowledge with practical
        routines designed specifically for deeper skin tones.
      </p>

      <p className={styles.muted}>
        Instead of complicated product stacks, the focus is on restoring the
        skin barrier, reducing inflammation, and building routines that work
        long-term.
      </p>
    </div>

    <div className={styles.expertCard}>
      <div className={styles.expertBadge}>Professional guidance</div>
      <div className={styles.expertName}>Rahwa</div>
      <div className={styles.expertTitle}>Licensed Aesthetician</div>
    </div>
  </div>
</section>

        {/* TESTIMONIALS */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.h2}>What clients say</h2>
            <p className={styles.muted}>
              Calm, practical feedback from people who wanted clarity and results.
            </p>
          </div>

          <div className={styles.grid3}>
            {testimonials.map((t) => (
              <div key={t.name} className={styles.quoteCard}>
                <p className={styles.quoteText}>&ldquo;{t.text}&rdquo;</p>
                <p className={styles.quoteName}>{t.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className={styles.cta}>
          <div className={styles.ctaInner}>
            <div>
              <h2 className={styles.h2}>Start with a plan that protects your skin barrier</h2>
              <p className={styles.muted}>
                Choose your package and begin with clear next steps.
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