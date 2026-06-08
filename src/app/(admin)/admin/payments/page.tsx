//src\app\(admin)\admin\payments\page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./admin-payments.module.css";


type Order = {
  _id: string;
  product: "course" | "consultation" | "bundle";
  amount: number;
  currency: string;
  reference: string;
  status: "created" | "pending" | "approved" | "rejected" | string;
  proofUrl?: string;
  createdAt: string;
};

function formatProduct(p: Order["product"]) {
  if (p === "course") return "Course";
  if (p === "consultation") return "Consultation";
  return "Bundle";
}

export default function AdminPaymentsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [actingId, setActingId] = useState<string | null>(null);

  const load = async () => {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/payments/list", { cache: "no-store" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(json.error || "Failed to load");
        return;
      }
      setOrders(json.orders || []);
    } catch {
      setErr("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const act = async (id: string, action: "approve" | "reject") => {
    setErr(null);
    setActingId(id);

    const adminNote =
      action === "reject" ? prompt("Reject reason (optional):") || "" : "";

    try {
      const res = await fetch(`/api/admin/payments/${id}/approve`, {
  method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, adminNote }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(json.error || "Action failed");
        return;
      }

      await load();
    } finally {
      setActingId(null);
    }
  };

  

  const counts = useMemo(() => {
    const c = { all: orders.length, pending: 0, created: 0, approved: 0, rejected: 0 };
    for (const o of orders) {
      if (o.status === "pending") c.pending++;
      else if (o.status === "created") c.created++;
      else if (o.status === "approved") c.approved++;
      else if (o.status === "rejected") c.rejected++;
    }
    return c;
  }, [orders]);

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div>
          <div className={styles.kicker}>Admin</div>
          <h1 className={styles.h1}>Payments</h1>
          <p className={styles.sub}>
            Review proofs, approve access, or reject with a note.
          </p>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.chips}>
            <span className={styles.chip}>All: {counts.all}</span>
            <span className={`${styles.chip} ${styles.chipPending}`}>Pending: {counts.pending}</span>
            <span className={styles.chip}>Created: {counts.created}</span>
            <span className={`${styles.chip} ${styles.chipOk}`}>Approved: {counts.approved}</span>
            <span className={`${styles.chip} ${styles.chipNo}`}>Rejected: {counts.rejected}</span>
          </div>

          <button className={styles.refresh} onClick={load} disabled={loading}>
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      {err && <div className={styles.alert}>{err}</div>}

      <div className={styles.grid}>
        {orders.map((o) => {
          const isPending = o.status === "pending";
          const isActing = actingId === o._id;

          return (
            <section key={o._id} className={styles.card}>
              <div className={styles.cardTop}>
                <div>
                  <div className={styles.titleRow}>
                    <div className={styles.title}>{formatProduct(o.product)}</div>
                    <span
                      className={[
                        styles.pill,
                        o.status === "pending" ? styles.pillPending : "",
                        o.status === "approved" ? styles.pillOk : "",
                        o.status === "rejected" ? styles.pillNo : "",
                        o.status === "created" ? styles.pillCreated : "",
                      ].join(" ")}
                    >
                      {o.status}
                    </span>
                  </div>

                  <div className={styles.meta}>
                    <span className={styles.amount}>
                      {o.amount} {o.currency}
                    </span>
                    <span className={styles.dot}>•</span>
                    <span className={styles.ref}>Ref: {o.reference}</span>
                  </div>
                </div>

                {o.proofUrl ? (
                  <a className={styles.proofBtn} href={o.proofUrl} target="_blank" rel="noreferrer">
                    Open proof
                  </a>
                ) : (
                  <span className={styles.noProof}>No proof</span>
                )}
              </div>

              <div className={styles.actions}>
                <button
                  className={styles.approve}
                  onClick={() => act(o._id, "approve")}
                  disabled={!isPending || isActing}
                  title={!isPending ? "Only pending orders can be approved" : ""}
                >
                  {isActing ? "Working…" : "Approve"}
                </button>

                <button
                  className={styles.reject}
                  onClick={() => act(o._id, "reject")}
                  disabled={!isPending || isActing}
                  title={!isPending ? "Only pending orders can be rejected" : ""}
                >
                  Reject
                </button>
              </div>

              {!isPending && (
                <div className={styles.hint}>
                  Tip: Only <b>pending</b> orders (proof submitted) can be approved/rejected.
                </div>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}
