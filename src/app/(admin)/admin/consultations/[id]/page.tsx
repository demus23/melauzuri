import Shell from "@/components/Shell";
import { requireAccess } from "@/lib/requireAccess";
import dbConnect from "@/lib/mongoose";
import ConsultationCase from "@/lib/models/ConsultationCase";
import User from "@/lib/models/User";
import { notFound } from "next/navigation";
import { Types } from "mongoose";
import styles from "./consultation-detail.module.css";
import StatusForm from "./StatusForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

function formatDate(value?: string | Date | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export default async function AdminConsultationDetailPage({
  params,
}: PageProps) {
  await requireAccess("admin");

  const { id } = await params;

  if (!Types.ObjectId.isValid(id)) {
    notFound();
  }

  await dbConnect();

  const consultation = await ConsultationCase.findById(id)
  .populate("userId", "name email")
  .lean();

  if (!consultation) {
    notFound();
  }

  const photos = consultation?.photos || [];

  return (
    <Shell>
      <div className={styles.page}>
        <section className={styles.hero}>
          <div>
            <div className={styles.badge}>Admin review</div>
            <h1 className={styles.h1}>Consultation Case</h1>
            <p className={styles.p}>
              Review submission details, update progress, and prepare client guidance.
            </p>
          </div>

          <div className={styles.heroSide}>
            <div className={styles.heroLabel}>Current status</div>
           <div className={styles.statusPill}>
  {consultation?.status || "pending_intake"}
</div>
          </div>
        </section>

        <section className={styles.grid}>
          <div className={styles.main}>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <h2 className={styles.h2}>Client details</h2>
              </div>

              <div className={styles.infoGrid}>
                <div>
                  <div className={styles.label}>Full name</div>
                 <div className={styles.value}>
  {consultation?.basicInfo?.fullName ||
    consultation?.userId?.name ||
    "—"}
</div>
                </div>

<div className={styles.card}>
  <div className={styles.cardHead}>
    <h2 className={styles.h2}>Skin Profile</h2>
  </div>

  <p>Skin type: {consultation?.skinProfile?.skinType || "-"}</p>
  <p>Sensitivity: {consultation?.skinProfile?.sensitivity || "-"}</p>
  <p>Main concern: {consultation?.skinProfile?.mainConcern || "-"}</p>
  <p>Other concerns: {consultation?.skinProfile?.otherConcerns || "-"}</p>
</div>

<div className={styles.card}>
  <div className={styles.cardHead}>
    <h2 className={styles.h2}>Routine</h2>
  </div>

  <p>AM: {consultation?.routine?.amRoutine || "-"}</p>
  <p>PM: {consultation?.routine?.pmRoutine || "-"}</p>
  <p>Actives: {consultation?.routine?.activeIngredients || "-"}</p>
</div>

                <div>
                  <div className={styles.label}>Email</div>
                  <div className={styles.value}>
                    {consultation?.userId?.email || "—"}
                  </div>
                </div>

                <div>
                  <div className={styles.label}>Phone</div>
                  <div className={styles.value}>
                    {(consultation as any).phone || "—"}
                  </div>
                </div>

                <div>
                  <div className={styles.label}>Submitted</div>
                  <div className={styles.value}>
                    {formatDate(consultation?.createdAt)}
                  </div>
                </div>

                <div>
                  <div className={styles.label}>Last updated</div>
                  <div className={styles.value}>
                    {formatDate((consultation as any).updatedAt)}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHead}>
                <h2 className={styles.h2}>Main concern</h2>
              </div>
              <p className={styles.bodyText}>
  {consultation?.skinProfile?.mainConcern || "—"}
</p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHead}>
                <h2 className={styles.h2}>Client notes</h2>
              </div>
              <p className={styles.bodyText}>
  {consultation?.history?.historyNotes || "—"}
</p>
            </div>

<div className={styles.card}>
  <div className={styles.cardHead}>
    <h2 className={styles.h2}>Deliver skincare plan</h2>
  </div>

  <form
    action={`/api/admin/consultations/${consultation._id}/result`}
    method="POST"
    style={{ display: "grid", gap: 12 }}
  >
    <textarea
      name="summary"
      placeholder="Consultation summary"
      defaultValue={consultation.result?.summary || ""}
      rows={4}
    />

    <textarea
      name="morningRoutine"
      placeholder="Morning routine"
      defaultValue={consultation.result?.morningRoutine || ""}
      rows={4}
    />

    <textarea
      name="nightRoutine"
      placeholder="Night routine"
      defaultValue={consultation.result?.nightRoutine || ""}
      rows={4}
    />

    <textarea
      name="productsToAvoid"
      placeholder="Products or ingredients to avoid"
      defaultValue={consultation.result?.productsToAvoid || ""}
      rows={3}
    />

    <textarea
      name="professionalAdvice"
      placeholder="Professional advice / next steps"
      defaultValue={consultation.result?.professionalAdvice || ""}
      rows={4}
    />

    <textarea
      name="followUpNote"
      placeholder="Follow-up note"
      defaultValue={consultation.result?.followUpNote || ""}
      rows={3}
    />

    <button type="submit" className={styles.primary}>
      Save and mark completed
    </button>
  </form>
</div>

            <div className={styles.card}>
              <div className={styles.cardHead}>
                <h2 className={styles.h2}>Uploaded photos</h2>
              </div>

              {photos.length === 0 ? (
                <p className={styles.muted}>No photos uploaded yet.</p>
              ) : (
                <div className={styles.photoGrid}>
                  {photos.map((photo: string, index: number) => (
                    <a
                      key={`${photo}-${index}`}
                      href={photo}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.photoCard}
                    >
                      <img
                        src={photo}
                        alt={`Consultation photo ${index + 1}`}
                        className={styles.photo}
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <h2 className={styles.h2}>Update status</h2>
              </div>

              <StatusForm
                consultationId={String(consultation._id)}
currentStatus={consultation.status || "pending_intake"}
              />
            </div>

            <div className={styles.card}>
              <div className={styles.cardHead}>
                <h2 className={styles.h2}>Quick summary</h2>
              </div>

              <div className={styles.summaryList}>
                <div className={styles.summaryItem}>
                  <span className={styles.label}>Status</span>
                  <span className={styles.value}>
                    {consultation?.status || "pending_intake"}
                  </span>
                </div>

                <div className={styles.summaryItem}>
                  <span className={styles.label}>Photos</span>
                  <span className={styles.value}>{photos.length}</span>
                </div>

                <div className={styles.summaryItem}>
                  <span className={styles.label}>Case ID</span>
                  <span className={styles.value}>{String((consultation as any)._id)}</span>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </Shell>
  );
}