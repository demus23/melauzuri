import Shell from "@/components/Shell";
import { requireAccess } from "@/lib/requireAccess";
import dbConnect from "@/lib/mongoose";
import JournalEntry from "@/lib/models/JournalEntry";
import styles from "./journal.module.css";
import JournalForm from "./JournalForm";
import Link from "next/link";

const feelingMeta: Record<string, { label: string; emoji: string }> = {
  great: { label: "Great", emoji: "🙂" },
  okay: { label: "Okay", emoji: "😐" },
  irritated: { label: "Irritated", emoji: "😕" },
  "flare-up": { label: "Flare-up", emoji: "😣" },
};

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function JournalPage() {
  const user = await requireAccess("journal");
  await dbConnect();

  const entries = await JournalEntry.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .limit(60)
    .lean();

  return (
    <Shell>
      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.badge}>Your skin journal</div>
          <h1 className={styles.h1}>Track your skin over time</h1>
          <p className={styles.p}>
            A private place to log how your skin feels, week to week. This stays
            visible only to you — it's not shared publicly, and it's not part of
            your consultation review unless you choose to bring it up with your
            specialist.
          </p>
        </section>

        <JournalForm />

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.h2}>Your entries</h2>
            <p className={styles.muted}>
              {entries.length === 0
                ? "Nothing logged yet — your first entry will appear here."
                : `${entries.length} ${entries.length === 1 ? "entry" : "entries"} so far.`}
            </p>
          </div>

          {entries.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.muted}>
                Logging once a week is usually enough to notice real patterns —
                flare-ups, what helped, what didn't.
              </p>
              <Link href="/consultations" className={styles.secondary}>
                Go to your consultation
              </Link>
            </div>
          ) : (
            <div className={styles.timeline}>
              {entries.map((entry: any) => {
                const meta = feelingMeta[entry.feeling] ?? feelingMeta.okay;
                return (
                  <div key={String(entry._id)} className={styles.entryCard}>
                    {entry.photoUrl && (
                      <img
                        src={entry.photoUrl}
                        alt="Skin journal photo"
                        className={styles.entryPhoto}
                      />
                    )}
                    <div className={styles.entryBody}>
                      <div className={styles.entryTop}>
                        <span className={styles.entryDate}>
                          {formatDate(entry.createdAt)}
                        </span>
                        <span className={styles.feelingPill}>
                          <span aria-hidden="true">{meta.emoji}</span>
                          {meta.label}
                        </span>
                      </div>
                      {entry.note && (
                        <p className={styles.entryNote}>{entry.note}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </Shell>
  );
}