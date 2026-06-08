"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./manual.module.css";

type Product = "course" | "consultation" | "bundle";
type Resp = { orderId: string; reference: string; amount: number; currency: string };

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

export default function ManualCheckoutPage() {
  const sp = useSearchParams();

  const initial = (sp.get("product") ?? "course") as Product;
  const [product, setProduct] = useState<Product>(initial);

  const [data, setData] = useState<Resp | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [copied, setCopied] = useState<string | null>(null);

  const wise = useMemo(
    () => ({
      accountName: "YOUR_WISE_ACCOUNT_NAME",
      ibanOrAccount: "PUT_YOUR_DETAILS_HERE",
      note: "Wise transfer",
    }),
    []
  );

  const createOrder = async () => {
  setErr(null);
  setLoading(true);
  setData(null);

  try {
    const res = await fetch("/api/payments/create-reference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product }),
    });

    if (res.status === 401) {
      setErr("Please log in to continue checkout.");
      return;
    }

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setErr(json.error || "Failed to create order");
      return;
    }

    setData(json);
  } catch {
    setErr("Network error. Please try again.");
  } finally {
    setLoading(false);
  }
};



  const onCopy = async (label: string, value: string) => {
    try {
      await copyText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 1200);
    } catch {
      setErr("Copy failed. Please copy manually.");
    }
  };

  useEffect(() => {
    createOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.top}>
        <div className={styles.crumbs}>
          <Link href="/pricing" className={styles.crumbLink}>Pricing</Link>
          <span className={styles.crumbDot}>•</span>
          <span className={styles.crumbHere}>Checkout</span>
        </div>

        <h1 className={styles.h1}>Complete payment</h1>
        <p className={styles.sub}>
          Use Wise transfer. Your order will be approved after we verify your payment proof.
        </p>
      </div>

      <div className={styles.grid}>
        {/* LEFT: Order + Steps */}
        <section className={styles.panel}>
          <div className={styles.panelTop}>
            <div>
              <div className={styles.kicker}>Step 1</div>
              <h2 className={styles.h2}>Choose what you’re paying for</h2>
            </div>
          </div>

          <div className={styles.pills}>
            <button
              type="button"
              className={`${styles.pill} ${product === "course" ? styles.pillActive : ""}`}
              onClick={() => setProduct("course")}
            >
              Course
            </button>
            <button
              type="button"
              className={`${styles.pill} ${product === "consultation" ? styles.pillActive : ""}`}
              onClick={() => setProduct("consultation")}
            >
              Consultation
            </button>
            <button
              type="button"
              className={`${styles.pill} ${product === "bundle" ? styles.pillActive : ""}`}
              onClick={() => setProduct("bundle")}
            >
              Bundle
            </button>

            <button
              type="button"
              className={styles.refresh}
              onClick={createOrder}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? "Generating…" : "Regenerate reference"}
            </button>
          </div>

          {err && (
  <div className={styles.error}>
    {err}

    {err.toLowerCase().includes("log in") && (
      <div style={{ marginTop: 10 }}>
        <Link
          className={styles.cta}
          href={`/login?callbackUrl=${encodeURIComponent(`/checkout/manual?product=${product}`)}`}
        >
          Log in to continue
        </Link>
      </div>
    )}
  </div>
)}



          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNum}>2</div>
              <div>
                <div className={styles.stepTitle}>Send the exact amount</div>
                <div className={styles.stepText}>
                  Use the details on the right. Don’t forget the reference code.
                </div>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNum}>3</div>
              <div>
                <div className={styles.stepTitle}>Upload proof</div>
                <div className={styles.stepText}>
                  Upload a screenshot or PDF so we can approve your order.
                </div>
              </div>
            </div>
          </div>

          <div className={styles.note}>
            Tip: The reference code helps us match your payment quickly.
          </div>
        </section>

        {/* RIGHT: Payment Card */}
        <aside className={styles.card}>
          <div className={styles.cardHead}>
            <div>
              <div className={styles.kicker}>Amount due</div>
              <div className={styles.amount}>
                {data ? formatMoney(data.amount, data.currency) : "—"}
              </div>
            </div>

            <div className={styles.badge}>{data ? data.currency : "..."}</div>
          </div>

          <div className={styles.hr} />

          <div className={styles.block}>
            <div className={styles.blockTitle}>Wise transfer details</div>

            <div className={styles.row}>
              <div className={styles.rowLabel}>Account name</div>
              <div className={styles.rowValue}>{wise.accountName}</div>
              <button
                type="button"
                className={styles.copy}
                onClick={() => onCopy("Account name", wise.accountName)}
              >
                {copied === "Account name" ? "Copied" : "Copy"}
              </button>
            </div>

            <div className={styles.row}>
              <div className={styles.rowLabel}>USD account / IBAN</div>
              <div className={styles.rowValue}>{wise.ibanOrAccount}</div>
              <button
                type="button"
                className={styles.copy}
                onClick={() => onCopy("IBAN", wise.ibanOrAccount)}
              >
                {copied === "IBAN" ? "Copied" : "Copy"}
              </button>
            </div>

            <div className={styles.row}>
              <div className={styles.rowLabel}>Reference code</div>
              <div className={styles.rowValueStrong}>
                {data ? data.reference : "Generating…"}
              </div>
              <button
                type="button"
                className={styles.copy}
                disabled={!data?.reference}
                onClick={() => data?.reference && onCopy("Reference", data.reference)}
              >
                {copied === "Reference" ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          <div className={styles.ctaWrap}>
            <Link
              className={`${styles.cta} ${!data?.orderId ? styles.ctaDisabled : ""}`}
              href={data?.orderId ? `/checkout/upload-proof?orderId=${data.orderId}` : "#"}
              aria-disabled={!data?.orderId}
              onClick={(e) => {
                if (!data?.orderId) e.preventDefault();
              }}
            >
              Upload payment proof
            </Link>

            <div className={styles.small}>
              After upload, your status becomes <b>Waiting approval</b>.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
