// src/app/(admin)/admin/page.tsx
import Link from "next/link";
import Shell from "@/components/Shell";
import { requireAccess } from "@/lib/requireAccess";
import dbConnect from "@/lib/mongoose";
import PaymentOrder from "@/lib/models/PaymentOrder";
import Consultation from "@/lib/models/Consultation";
import styles from "./admin-home.module.css";

export default async function AdminHomePage() {
  await requireAccess("admin");
  await dbConnect();

  const [
    totalPayments,
    createdPayments,
    pendingPayments,
    approvedPayments,
    rejectedPayments,
    totalConsultations,
    newConsultations,
    reviewingConsultations,
    completedConsultations,
  ] = await Promise.all([
    PaymentOrder.countDocuments({}),
    PaymentOrder.countDocuments({ status: "created" }),
    PaymentOrder.countDocuments({ status: "pending" }),
    PaymentOrder.countDocuments({ status: "approved" }),
    PaymentOrder.countDocuments({ status: "rejected" }),
    Consultation.countDocuments({}),
    Consultation.countDocuments({ status: "new" }),
    Consultation.countDocuments({ status: "reviewing" }),
    Consultation.countDocuments({ status: "completed" }),
  ]);

  return (
    <Shell>
      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.badge}>Admin dashboard</div>
          <h1 className={styles.h1}>Admin Control Center</h1>
          <p className={styles.p}>
            Manage payments, consultations, courses, lessons, and platform activity.
          </p>
        </section>

        <section className={styles.topStats}>
          <div className={styles.topCard}>
            <span>Pending payments</span>
            <strong>{pendingPayments}</strong>
          </div>

          <div className={styles.topCard}>
            <span>Approved payments</span>
            <strong>{approvedPayments}</strong>
          </div>

          <div className={styles.topCard}>
            <span>New consultations</span>
            <strong>{newConsultations}</strong>
          </div>

          <div className={styles.topCard}>
            <span>Under review</span>
            <strong>{reviewingConsultations}</strong>
          </div>
        </section>

        <section className={styles.grid}>
          <Link href="/admin/payments" className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <p className={styles.cardEyebrow}>Payment management</p>
                <h2 className={styles.cardTitle}>Payments</h2>
              </div>
              <span className={styles.openLink}>Open</span>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>Total</span>
                <strong className={styles.statValue}>{totalPayments}</strong>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>Created</span>
                <strong className={styles.statValue}>{createdPayments}</strong>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>Pending</span>
                <strong className={styles.statValue}>{pendingPayments}</strong>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>Approved</span>
                <strong className={styles.statValue}>{approvedPayments}</strong>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>Rejected</span>
                <strong className={styles.statValue}>{rejectedPayments}</strong>
              </div>
            </div>
          </Link>

          <Link href="/admin/consultations" className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <p className={styles.cardEyebrow}>Consultation workflow</p>
                <h2 className={styles.cardTitle}>Consultations</h2>
              </div>
              <span className={styles.openLink}>Open</span>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>Total</span>
                <strong className={styles.statValue}>{totalConsultations}</strong>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>New</span>
                <strong className={styles.statValue}>{newConsultations}</strong>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>Reviewing</span>
                <strong className={styles.statValue}>{reviewingConsultations}</strong>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>Completed</span>
                <strong className={styles.statValue}>{completedConsultations}</strong>
              </div>
            </div>
          </Link>

          <Link href="/admin/courses" className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <p className={styles.cardEyebrow}>Course platform</p>
                <h2 className={styles.cardTitle}>Courses</h2>
              </div>
              <span className={styles.openLink}>Open</span>
            </div>

            <p className={styles.p}>
              Create courses, edit course details, manage pricing, and publish content.
            </p>
          </Link>

          <Link href="/admin/lessons" className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <p className={styles.cardEyebrow}>Lesson management</p>
                <h2 className={styles.cardTitle}>Lessons</h2>
              </div>
              <span className={styles.openLink}>Open</span>
            </div>

            <p className={styles.p}>
              Add lesson videos, edit lesson content, organize course modules, and update access.
            </p>
          </Link>
        </section>
      </div>
    </Shell>
  );
}