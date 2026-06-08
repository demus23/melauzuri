/*src\app\(admin)\admin\consultations\page.tsx*/
import Shell from "@/components/Shell";
import { requireAccess } from "@/lib/requireAccess";
import dbConnect from "@/lib/mongoose";
import ConsultationCase from "@/lib/models/ConsultationCase";
import styles from "./consultations-admin.module.css";

function formatRelativeDate(date: Date | string) {
  const value = new Date(date);
  return value.toLocaleString();
}

export default async function AdminConsultationsPage() {
  await requireAccess("admin");

  await dbConnect();

 const consultations = await ConsultationCase.find({})
  .populate("userId", "name email")
  .sort({ updatedAt: -1, createdAt: -1 })
  .lean();

  const pendingCount = consultations.filter(
  (item) => item.status === "pending_intake" || item.status === "active"
).length;

const awaitingPhotosCount = consultations.filter(
  (item) => !item.photosUploaded
).length;

const plansReadyCount = consultations.filter(
  (item) => item.status === "completed"
).length;

  return (
    <Shell>
      <div className={styles.page}>
        <section className={styles.hero}>
          <div>
            <div className={styles.badge}>Admin area</div>
            <h1 className={styles.h1}>Consultation Reviews</h1>
            <p className={styles.p}>
              Review submitted consultations, track progress, and prepare
              guidance for each client.
            </p>
          </div>

          <div className={styles.heroCard}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatLabel}>Pending</span>
              <strong>{pendingCount}</strong>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatLabel}>Awaiting photos</span>
              <strong>{awaitingPhotosCount}</strong>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatLabel}>Plans ready</span>
              <strong>{plansReadyCount}</strong>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.h2}>Recent consultations</h2>
            <p className={styles.muted}>
              This is the queue Rahwa will use to review consultation cases.
            </p>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Email</th>
                  <th>Main concern</th>
                  <th>Status</th>
                  <th>Last updated</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {consultations.length === 0 ? (
                  <tr>
                    <td colSpan={6}>No consultation submissions found.</td>
                  </tr>
                ) : (
                  consultations.map((item) => (
                   <tr key={String(item._id)}>
  <td>{item.basicInfo?.fullName || item.userId?.name || "—"}</td>
  <td>{item.userId?.email || "—"}</td>
  <td>{item.skinProfile?.mainConcern || "—"}</td>
  <td>
    <span className={styles.statusTag}>
      {item.status || "pending_intake"}
    </span>
  </td>
  <td>{formatRelativeDate(item.updatedAt || item.createdAt)}</td>
  <td>
    <a
      href={`/admin/consultations/${item._id}`}
      className={styles.actionLink}
    >
      Open review
    </a>
  </td>
</tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Shell>
  );
}