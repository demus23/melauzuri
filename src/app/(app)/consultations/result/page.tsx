import Shell from "@/components/Shell";
import { requireAccess } from "@/lib/requireAccess";
import styles from "./result.module.css";

const amRoutine = [
  "Gentle cleanser",
  "Hydrating or pigment-safe treatment",
  "Moisturizer",
  "Broad-spectrum sunscreen",
];

const pmRoutine = [
  "Gentle cleanser",
  "Target treatment on scheduled nights",
  "Barrier-supporting moisturizer",
];

const notes = [
  "Avoid adding multiple strong actives at the same time.",
  "Do not over-exfoliate while the skin barrier is recovering.",
  "Use sunscreen daily to reduce rebound pigmentation.",
  "Introduce new products slowly and monitor irritation.",
];

export default async function ConsultationResultPage() {
  await requireAccess("consultation");

  return (
    <Shell>
      <div className={styles.page}>
        <section className={styles.hero}>
          <div>
            <div className={styles.badge}>Consultation result</div>
            <h1 className={styles.h1}>Your Personalized Skin Plan</h1>
            <p className={styles.p}>
              Your consultation review is complete. Follow this structure
              consistently and keep the routine simple while your skin improves.
            </p>
          </div>

          <div className={styles.heroCard}>
            <div className={styles.heroLabel}>Plan status</div>
            <div className={styles.statusPill}>Ready</div>
            <p className={styles.heroText}>
              Your routine has been prepared and is now available in your dashboard.
            </p>
          </div>
        </section>

        <section className={styles.grid}>
          <article className={styles.card}>
            <h2 className={styles.h2}>AM Routine</h2>
            <ol className={styles.list}>
              {amRoutine.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </article>

          <article className={styles.card}>
            <h2 className={styles.h2}>PM Routine</h2>
            <ol className={styles.list}>
              {pmRoutine.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </article>
        </section>

        <section className={styles.card}>
          <h2 className={styles.h2}>Professional Notes</h2>
          <p className={styles.muted}>
            Focus on consistency, skin barrier protection, and gradual improvement
            rather than using too many products at once.
          </p>
        </section>

        <section className={styles.card}>
          <h2 className={styles.h2}>Important Guidance</h2>
          <ul className={styles.bulletList}>
            {notes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className={styles.card}>
          <h2 className={styles.h2}>Follow-up</h2>
          <p className={styles.muted}>
            Track changes in pigmentation, irritation, or breakouts over the next
            few weeks. Your follow-up review can later be added here.
          </p>
        </section>
      </div>
    </Shell>
  );
}