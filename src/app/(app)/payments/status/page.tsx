"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Shell from "@/components/Shell";
import styles from "./status.module.css";

type OrderStatus = "loading" | "no-order" | "created" | "pending" | "approved" | "rejected" | "unknown";

export default function PaymentStatusPage() {
  const [status, setStatus] = useState<OrderStatus>("loading");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/payments/my-latest", { cache: "no-store" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) return setStatus("unknown");
      setStatus((json.order?.status || "no-order") as OrderStatus);
    })();
  }, []);

  const meta = useMemo(() => {
    switch (status) {
      case "loading":
        return { tone: "muted", title: "Checking your payment…", desc: "One moment while we load your latest order." };
      case "no-order":
        return { tone: "muted", title: "No payment yet", desc: "When you submit a payment proof, it will appear here." };
      case "created":
        return { tone: "warn", title: "Order created", desc: "Please upload your Wise receipt so we can approve your access." };
      case "pending":
        return { tone: "good", title: "Proof submitted", desc: "✅ Waiting for approval. We’ll activate access after review." };
      case "approved":
        return { tone: "good", title: "Approved!", desc: "🎉 Your access is active. You can start your plan now." };
      case "rejected":
        return { tone: "bad", title: "Not approved", desc: "❌ Your proof was rejected. Please upload a clearer receipt or contact support." };
      default:
        return { tone: "bad", title: "Couldn’t load status", desc: "Please refresh the page and try again." };
    }
  }, [status]);

  const stepIndex =
    status === "approved" ? 3 :
    status === "pending" ? 2 :
    status === "created" ? 1 :
    0;

  return (
    <Shell>
      <div className={styles.page}>
        <div className={styles.head}>
          <div>
            <div className={styles.crumbs}>
              <Link href="/pricing">Pricing</Link>
              <span className={styles.dot}>•</span>
              <span>Payment status</span>
            </div>
            <h1 className={styles.h1}>Payment status</h1>
            <p className={styles.sub}>
              Track your Wise payment and access approval in one place.
            </p>
          </div>

          <div className={styles.actionsTop}>
            <Link href="/dashboard" className={styles.ghostBtn}>Dashboard</Link>
            <Link href="/checkout/manual?product=bundle" className={styles.primaryBtn}>Start a new payment</Link>
          </div>
        </div>

        <div className={styles.grid}>
          {/* LEFT: status card */}
          <div className={styles.card}>
            <div className={styles.cardTop}>
              <span className={`${styles.badge} ${styles[meta.tone]}`}>
                {status === "loading" ? "Loading" : status.replace("-", " ")}
              </span>
              <span className={styles.smallMuted}>Updated just now</span>
            </div>

            <h2 className={styles.h2}>{meta.title}</h2>
            <p className={styles.muted}>{meta.desc}</p>

            <div className={styles.divider} />

            <div className={styles.ctaRow}>
              {status === "created" && (
                <Link href="/checkout/upload-proof" className={styles.primaryBtn}>
                  Upload proof
                </Link>
              )}

              {status === "pending" && (
                <button className={styles.secondaryBtn} onClick={() => window.location.reload()}>
                  Refresh
                </button>
              )}

              {status === "approved" && (
                <>
                  <Link href="/course" className={styles.primaryBtn}>Go to course</Link>
                  <Link href="/dashboard" className={styles.secondaryBtn}>Back to dashboard</Link>
                </>
              )}

              {status === "rejected" && (
                <>
                  <Link href="/checkout/manual?product=bundle" className={styles.primaryBtn}>
                    Try again
                  </Link>
                  <Link href="/support" className={styles.secondaryBtn}>
                    Contact support
                  </Link>
                </>
              )}

              {(status === "no-order" || status === "unknown" || status === "loading") && (
                <Link href="/pricing" className={styles.primaryBtn}>View plans</Link>
              )}
            </div>

            <p className={styles.tip}>
              Tip: Use your <b>reference code</b> on Wise so we can match your payment quickly.
            </p>
          </div>

          {/* RIGHT: steps / timeline */}
          <div className={styles.card}>
            <h3 className={styles.h3}>Approval steps</h3>
            <p className={styles.muted}>A simple flow that keeps your account secure.</p>

            <div className={styles.steps}>
              <Step
                index={1}
                title="Order created"
                desc="We generate your reference and amount."
                active={stepIndex >= 1}
              />
              <Step
                index={2}
                title="Proof submitted"
                desc="You upload a screenshot or PDF receipt."
                active={stepIndex >= 2}
              />
              <Step
                index={3}
                title="Approved"
                desc="We confirm the payment and unlock access."
                active={stepIndex >= 3}
              />
            </div>

            <div className={styles.helpBox}>
              <div className={styles.helpTitle}>Need help?</div>
              <div className={styles.helpText}>
                Make sure your receipt clearly shows <b>amount</b>, <b>date</b>, and <b>reference code</b>.
              </div>
              <Link href="/support" className={styles.link}>Go to support</Link>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Step({
  index,
  title,
  desc,
  active,
}: {
  index: number;
  title: string;
  desc: string;
  active: boolean;
}) {
  return (
    <div className={`${active ? styles.stepActive : styles.step}`}>
      <div className={styles.stepLeft}>
        <div className={`${styles.stepNum} ${active ? styles.stepNumOn : ""}`}>{index}</div>
      </div>
      <div className={styles.stepBody}>
        <div className={styles.stepTitle}>{title}</div>
        <div className={styles.stepDesc}>{desc}</div>
      </div>
    </div>
  );
}
