import Shell from "@/components/Shell";
import { requireAccess } from "@/lib/requireAccess";
import Link from "next/link";
import styles from "./consultations.module.css";
import dbConnect from "@/lib/mongoose";
import ConsultationCase from "@/lib/models/ConsultationCase";

const defaultSteps = [
  {
    title: "Complete skin questionnaire",
    desc: "Tell us about your skin goals, concerns, routine, whitening cream history, melasma history, and previous treatments.",
    cta: "Start questionnaire",
    href: "/consultations/start",
  },
  {
    title: "Upload clear skin photos",
    desc: "Upload front, left side, right side, and close-up photos in bright natural lighting.",
    cta: "Upload photos",
    href: "/consultations/photos",
  },
  {
    title: "Receive your skin plan",
    desc: "Your case will be reviewed, and dermatologist input will be added if your concern needs specialist support.",
    cta: "View status",
    href: "/consultations/status",
  },
];

const prepareList = [
  "Your main skin goals",
  "Current morning and night skincare routine",
  "Products you are currently using",
  "History of whitening creams, steroid creams, hydroquinone, peels, or laser",
  "Melasma, pigmentation, acne, or sensitivity history",
  "Lifestyle details such as sleep, stress, water intake, and diet habits",
  "Clear front, left side, right side, and concern-area photos",
];

const supportAreas = [
  "Whitening cream damage recovery",
  "Melasma support and management",
  "Hyperpigmentation and dark spots",
  "Acne and post-acne marks",
  "Sensitive or reactive skin",
  "Skin barrier repair",
  "Overall healthy skin support",
  "Aging gracefully skin management",
];

export default async function ConsultationsPage() {
  const user = await requireAccess("consultation");
  await dbConnect();

  const consultationCase = await ConsultationCase.findOne({
    userId: user._id,
  })
    .sort({ createdAt: -1 })
    .lean();

  let badge = "Consultation access active";
  let statusText = "Ready to begin";
  let heroText =
    "Start your Melazuri consultation by completing your skin questionnaire and uploading clear photos for professional review.";
  let heroCta = "Start questionnaire";
  let heroHref = "/consultations/start";

  if (!consultationCase) {
    badge = "Access active";
    statusText = "Waiting for consultation record";
    heroText =
      "Your access is active, but your consultation record is not ready yet. If you recently completed payment, please check again shortly or contact support.";
    heroCta = "Refresh";
    heroHref = "/consultations";
  } else if (consultationCase.status === "pending_intake") {
    badge = "Consultation created";
    statusText = "Pending intake";
    heroText =
      "Your consultation has been created. Complete your questionnaire and upload your photos so your case can be reviewed.";
    heroCta = "Start questionnaire";
    heroHref = "/consultations/start";
  } else if (consultationCase.status === "active") {
    badge = "Consultation in progress";
    statusText = "Under review";
    heroText =
      "Your consultation is now under review. You can check your status and next updates in your dashboard.";
    heroCta = "View consultation status";
    heroHref = "/consultations/status";
  } else if (consultationCase.status === "completed") {
    badge = "Consultation completed";
    statusText = "Completed";
    heroText =
      "Your consultation has been completed. You can review your skin plan, recommendations, and next steps in your dashboard.";
    heroCta = "View consultation status";
    heroHref = "/consultations/status";
  } else if (consultationCase.status === "cancelled") {
    badge = "Consultation cancelled";
    statusText = "Cancelled";
    heroText =
      "This consultation has been cancelled. Please contact support if you believe this was a mistake.";
    heroCta = "Contact support";
    heroHref = "/support";
  }

  return (
    <Shell>
      <div className={styles.page}>
        <section className={styles.hero}>
          <div>
            <div className={styles.badge}>{badge}</div>
            <h1 className={styles.h1}>Your Melazuri Consultation</h1>
            <p className={styles.p}>{heroText}</p>

            <div className={styles.heroActions}>
              <Link href={heroHref} className={styles.primary}>
                {heroCta}
              </Link>
              <Link href="/pricing" className={styles.secondary}>
                View pricing
              </Link>
            </div>
          </div>

          <div className={styles.heroCard}>
            <div className={styles.heroCardLabel}>Current status</div>
            <div className={styles.statusPill}>{statusText}</div>

            <p className={styles.heroCardText}>
              {consultationCase
                ? `Consultation reference: ${String(consultationCase.reference)}`
                : "We have not found a consultation record for your account yet."}
            </p>

            <div className={styles.priceBox}>
              <div>
                <span>Consultation</span>
                <strong>USD 50</strong>
              </div>
              <div>
                <span>Dermatologist add-on if needed</span>
                <strong>+ USD 50</strong>
              </div>
              <div>
                <span>Bundle with course access</span>
                <strong>USD 129</strong>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.h2}>Your next steps</h2>
            <p className={styles.muted}>
              Follow these steps so your skin concern can be reviewed clearly and safely.
            </p>
          </div>

          <div className={styles.grid3}>
            {defaultSteps.map((step, i) => (
              <div key={step.title} className={styles.card}>
                <div className={styles.stepTop}>
                  <div className={styles.stepNum}>{i + 1}</div>
                  <div className={styles.stepTitle}>{step.title}</div>
                </div>
                <p className={styles.muted}>{step.desc}</p>
                <Link href={step.href} className={styles.secondary}>
                  {step.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.sectionAlt}>
          <div className={styles.infoPanel}>
            <div>
              <div className={styles.badge}>Before you start</div>
              <h2 className={styles.h2}>What to prepare</h2>
              <p className={styles.muted}>
                These details help us understand your skin history, routine, and possible triggers.
              </p>
            </div>

            <ul className={styles.list}>
              {prepareList.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.h2}>Common concerns we support</h2>
            <p className={styles.muted}>
              Melazuri focuses on education, safe guidance, and long-term skin health.
            </p>
          </div>

          <div className={styles.grid4}>
            {supportAreas.map((item) => (
              <div key={item} className={styles.concernCard}>
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className={styles.disclaimer}>
          <strong>Important note:</strong> Melazuri provides education and skincare guidance.
          It is not a replacement for emergency care or in-person medical diagnosis.
        </section>
      </div>
    </Shell>
  );
}