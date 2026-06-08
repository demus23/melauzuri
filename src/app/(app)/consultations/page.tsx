import Shell from "@/components/Shell";
import { requireAccess } from "@/lib/requireAccess";
import Link from "next/link";
import styles from "./consultations.module.css";
import dbConnect from "@/lib/mongoose";
import ConsultationCase from "@/lib/models/ConsultationCase";

const defaultSteps = [
  {
    title: "Complete questionnaire",
    desc: "Tell us about your skin type, main concerns, routine, and treatment history.",
    cta: "Start questionnaire",
    href: "/consultations/start",
  },
  {
    title: "Upload skin photos",
    desc: "Share clear front and side photos in good lighting for better review.",
    cta: "Upload photos",
    href: "/consultations/photos",
  },
  {
    title: "Receive your plan",
    desc: "After review, your routine and next steps will appear in your dashboard.",
    cta: "View consultation status",
    href: "/consultations/status",
  },
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
    "Start your consultation by completing your skin information and uploading clear photos for review.";
  let heroCta = "Start now";
  let heroHref = "/consultations/start";

  if (!consultationCase) {
    badge = "Access active";
    statusText = "Waiting for consultation record";
    heroText =
      "Your payment access is active, but your consultation workflow record is not ready yet. If you recently completed payment, please check again shortly or contact support.";
    heroCta = "Refresh";
    heroHref = "/consultations";
  } else if (consultationCase.status === "pending_intake") {
    badge = "Consultation created";
    statusText = "Pending intake";
    heroText =
      "Your consultation has been created. The next step is to complete your questionnaire and upload your photos.";
    heroCta = "Start questionnaire";
    heroHref = "/consultations/start";
  } else if (consultationCase.status === "active") {
    badge = "Consultation in progress";
    statusText = "Under review";
    heroText =
      "Your consultation is already in progress. You can check your current status and next updates in your dashboard.";
    heroCta = "View consultation status";
    heroHref = "/consultations/status";
  } else if (consultationCase.status === "completed") {
    badge = "Consultation completed";
    statusText = "Completed";
    heroText =
      "Your consultation has been completed. You can review your status and any next-step recommendations in your dashboard.";
    heroCta = "View consultation status";
    heroHref = "/consultations/status";
  } else if (consultationCase.status === "cancelled") {
    badge = "Consultation cancelled";
    statusText = "Cancelled";
    heroText =
      "This consultation has been cancelled. Please contact support if you believe this was a mistake.";
    heroCta = "View consultation status";
    heroHref = "/consultations/status";
  }

  return (
    <Shell>
      <div className={styles.page}>
        <section className={styles.hero}>
          <div>
            <div className={styles.badge}>{badge}</div>
            <h1 className={styles.h1}>Your Consultation Dashboard</h1>
            <p className={styles.p}>{heroText}</p>
          </div>

          <div className={styles.heroCard}>
            <div className={styles.heroCardLabel}>Current status</div>
            <div className={styles.statusPill}>{statusText}</div>
            <p className={styles.heroCardText}>
              {consultationCase
                ? `Consultation reference: ${String(consultationCase.reference)}`
                : "We have not found a consultation record for your account yet."}
            </p>
            <Link href={heroHref} className={styles.primary}>
              {heroCta}
            </Link>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.h2}>Your next steps</h2>
            <p className={styles.muted}>
              Follow these steps to complete your consultation flow.
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
              <h2 className={styles.h2}>What to prepare</h2>
              <p className={styles.muted}>
                Before starting, keep these details ready so your consultation
                can be reviewed properly.
              </p>
            </div>

            <ul className={styles.list}>
              <li>Your main skin concerns</li>
              <li>Your current AM/PM routine</li>
              <li>Products you are currently using</li>
              <li>Recent irritation, breakouts, or pigmentation changes</li>
              <li>Clear photos in natural or bright lighting</li>
            </ul>
          </div>
        </section>
      </div>
    </Shell>
  );
}