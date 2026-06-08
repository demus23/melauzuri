import Shell from "@/components/Shell";
import { requireAccess } from "@/lib/requireAccess";
import dbConnect from "@/lib/mongoose";
import ConsultationCase from "@/lib/models/ConsultationCase";
import Link from "next/link";
import styles from "./status.module.css";

type TimelineItem = {
  title: string;
  status: string;
  desc: string;
};

function buildTimeline(consultation: any): TimelineItem[] {
  const hasQuestionnaire = consultation?.intakeCompleted === true;
  const hasPhotos =
    Array.isArray(consultation?.photos) && consultation.photos.length > 0;

  const status = consultation?.status || "pending_intake";

  return [
    {
      title: "Questionnaire",
      status: hasQuestionnaire ? "Completed" : "Pending",
      desc: hasQuestionnaire
        ? "Your skin details have been submitted."
        : "Your consultation form is still incomplete.",
    },
    {
      title: "Photo upload",
      status: hasPhotos ? "Completed" : "Pending",
      desc: hasPhotos
        ? "Your photos were uploaded successfully."
        : "Photos are still needed for full review.",
    },
    {
      title: "Expert review",
      status: status === "active" ? "In progress" : "Waiting",
      desc:
        status === "active"
          ? "Your consultation is currently under expert review."
          : "Your consultation will be reviewed after submission is complete.",
    },
    {
      title: "Routine delivery",
      status: status === "completed" ? "Ready" : "Waiting",
      desc:
        status === "completed"
          ? "Your personalized guidance is ready."
          : "Your personalized guidance will appear here once ready.",
    },
  ];
}

function getSummary(consultation: any) {
  if (!consultation) {
    return {
      currentStatus: "No consultation found",
      summaryText:
        "Your payment is approved but consultation setup is still processing.",
      nextActionText: "Please refresh or contact support.",
      nextActionHref: "/consultations",
      nextActionLabel: "Refresh",
    };
  }

  if (!consultation.intakeCompleted) {
    return {
      currentStatus: "Questionnaire needed",
      summaryText:
        "Complete your questionnaire to begin your consultation.",
      nextActionText: "Fill in your consultation form.",
      nextActionHref: "/consultations/start",
      nextActionLabel: "Start questionnaire",
    };
  }

  if (!consultation.photosUploaded) {
    return {
      currentStatus: "Photos required",
      summaryText:
        "Upload your skin photos so we can begin your consultation review.",
      nextActionText: "Upload your photos.",
      nextActionHref: "/consultations/photos",
      nextActionLabel: "Upload photos",
    };
  }

  if (consultation.status === "active") {
    return {
      currentStatus: "Under review",
      summaryText:
        "Your consultation is being reviewed by our expert.",
      nextActionText: "No action needed right now.",
      nextActionHref: "/consultations/status",
      nextActionLabel: "Refresh status",
    };
  }

  if (consultation.status === "completed") {
    return {
      currentStatus: "Plan ready",
      summaryText:
        "Your personalized skincare plan is ready.",
      nextActionText: "View your results.",
      nextActionHref: "/consultations/results",
      nextActionLabel: "View results",
    };
  }

  return {
    currentStatus: "In progress",
    summaryText: "Your consultation is being processed.",
    nextActionText: "Check back shortly.",
    nextActionHref: "/consultations/status",
    nextActionLabel: "Refresh",
  };
}

      
  


export default async function ConsultationStatusPage() {
  const user = await requireAccess("consultation");

await dbConnect();

const consultation = await ConsultationCase.findOne({
  userId: user._id,
})
  .sort({ createdAt: -1 })
  .lean();

  const timeline = buildTimeline(consultation);
  const summary = getSummary(consultation);

  return (
    <Shell>
      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.badge}>Step 3 of 3</div>
          <h1 className={styles.h1}>Consultation Status</h1>
          <p className={styles.p}>
            Track your progress and see what is still needed before review.
          </p>
        </section>

        <section className={styles.summary}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>Current status</div>
            <div className={styles.statusPill}>{summary.currentStatus}</div>
            <p className={styles.summaryText}>{summary.summaryText}</p>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>Next best action</div>
            <p className={styles.summaryText}>{summary.nextActionText}</p>
            <Link href={summary.nextActionHref} className={styles.primary}>
              {summary.nextActionLabel}
            </Link>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.h2}>Progress timeline</h2>
            <p className={styles.muted}>
              This area now updates automatically from your consultation data.
            </p>
          </div>

          <div className={styles.timeline}>
            {timeline.map((item) => (
              <div key={item.title} className={styles.card}>
                <div className={styles.cardTop}>
                  <h3 className={styles.h3}>{item.title}</h3>
                  <span className={styles.statusTag}>{item.status}</span>
                </div>
                <p className={styles.muted}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}