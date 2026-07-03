"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./manual.module.css";

type Product = "course" | "consultation" | "bundle";
type PaymentMethod = "stripe" | "bank_transfer" | "other";

type Resp = {
  orderId: string;
  reference: string;
  amount: number;
  currency: string;
};

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
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("bank_transfer");

  const [data, setData] = useState<Resp | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const bank = useMemo(
    () => ({
      accountName: "YOUR_BANK_ACCOUNT_NAME",
      bankName: "YOUR_BANK_NAME",
      iban: "YOUR_IBAN_HERE",
      currency: "USD",
    }),
    []
  );

  const otherPayment = useMemo(
    () => ({
      title: "Other payment method",
      instruction:
        "Please contact Melazuri support on WhatsApp after payment and send your payment reference.",
      whatsapp: "YOUR_WHATSAPP_NUMBER",
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
        body: JSON.stringify({ product, paymentMethod }),
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

  const startStripeCheckout = async () => {
    setErr(null);
    setStripeLoading(true);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });

      if (res.status === 401) {
        setErr("Please log in to continue checkout.");
        return;
      }

      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json.url) {
        setErr(json.error || "Failed to start Stripe checkout");
        return;
      }

      window.location.href = json.url;
    } catch {
      setErr("Stripe checkout failed. Please try again.");
    } finally {
      setStripeLoading(false);
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
    if (paymentMethod !== "stripe") {
      createOrder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, paymentMethod]);

  return (
    <div className={styles.page}>
      <div className={styles.top}>
        <div className={styles.crumbs}>
          <Link href="/pricing" className={styles.crumbLink}>
            Pricing
          </Link>
          <span className={styles.crumbDot}>•</span>
          <span className={styles.crumbHere}>Checkout</span>
        </div>

        <h1 className={styles.h1}>Complete payment</h1>
        <p className={styles.sub}>
          Choose card payment, bank transfer, or another manual payment method.
        </p>
      </div>

      <div className={styles.grid}>
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
              className={`${styles.pill} ${
                product === "course" ? styles.pillActive : ""
              }`}
              onClick={() => setProduct("course")}
            >
              Course
            </button>

            <button
              type="button"
              className={`${styles.pill} ${
                product === "consultation" ? styles.pillActive : ""
              }`}
              onClick={() => setProduct("consultation")}
            >
              Consultation
            </button>

            <button
              type="button"
              className={`${styles.pill} ${
                product === "bundle" ? styles.pillActive : ""
              }`}
              onClick={() => setProduct("bundle")}
            >
              Bundle
            </button>
          </div>

          <div className={styles.panelTop} style={{ marginTop: 28 }}>
            <div>
              <div className={styles.kicker}>Step 2</div>
              <h2 className={styles.h2}>Choose payment method</h2>
            </div>
          </div>

          <div className={styles.pills}>
            <button
              type="button"
              className={`${styles.pill} ${
                paymentMethod === "stripe" ? styles.pillActive : ""
              }`}
              onClick={() => setPaymentMethod("stripe")}
            >
              Card / Stripe
            </button>

            <button
              type="button"
              className={`${styles.pill} ${
                paymentMethod === "bank_transfer" ? styles.pillActive : ""
              }`}
              onClick={() => setPaymentMethod("bank_transfer")}
            >
              Bank transfer
            </button>

            <button
              type="button"
              className={`${styles.pill} ${
                paymentMethod === "other" ? styles.pillActive : ""
              }`}
              onClick={() => setPaymentMethod("other")}
            >
              Other method
            </button>
          </div>

          {err && (
            <div className={styles.error}>
              {err}

              {err.toLowerCase().includes("log in") && (
                <div style={{ marginTop: 10 }}>
                  <Link
                    className={styles.cta}
                    href={`/login?callbackUrl=${encodeURIComponent(
                      `/checkout/manual?product=${product}`
                    )}`}
                  >
                    Log in to continue
                  </Link>
                </div>
              )}
            </div>
          )}

          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNum}>3</div>
              <div>
                <div className={styles.stepTitle}>
                  {paymentMethod === "stripe"
                    ? "Pay securely by card"
                    : "Send the exact amount"}
                </div>
                <div className={styles.stepText}>
                  {paymentMethod === "stripe"
                    ? "Stripe card payment gives automatic access after successful payment."
                    : "Use the payment reference code so we can match your payment quickly."}
                </div>
              </div>
            </div>

            {paymentMethod !== "stripe" && (
              <div className={styles.step}>
                <div className={styles.stepNum}>4</div>
                <div>
                  <div className={styles.stepTitle}>Upload proof</div>
                  <div className={styles.stepText}>
                    Upload a screenshot or PDF so admin can approve your order.
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.note}>
            Stripe payment is automatic. Bank transfer and other payment methods
            need manual approval.
          </div>
        </section>

        <aside className={styles.card}>
          <div className={styles.cardHead}>
            <div>
              <div className={styles.kicker}>Amount due</div>
              <div className={styles.amount}>
                {data ? formatMoney(data.amount, data.currency) : "—"}
              </div>
            </div>

            <div className={styles.badge}>{data ? data.currency : "USD"}</div>
          </div>

          <div className={styles.hr} />

          {paymentMethod === "stripe" && (
            <div className={styles.block}>
              <div className={styles.blockTitle}>Card payment</div>
              <p className={styles.stepText}>
                Pay securely using Stripe. Your access will be activated
                automatically after successful payment.
              </p>

              <button
                type="button"
                className={styles.cta}
                onClick={startStripeCheckout}
                disabled={stripeLoading}
              >
                {stripeLoading ? "Opening Stripe…" : "Pay by card"}
              </button>
            </div>
          )}

          {paymentMethod === "bank_transfer" && (
            <div className={styles.block}>
              <div className={styles.blockTitle}>Bank transfer details</div>

              <div className={styles.row}>
                <div className={styles.rowLabel}>Account name</div>
                <div className={styles.rowValue}>{bank.accountName}</div>
                <button
                  type="button"
                  className={styles.copy}
                  onClick={() => onCopy("Account name", bank.accountName)}
                >
                  {copied === "Account name" ? "Copied" : "Copy"}
                </button>
              </div>

              <div className={styles.row}>
                <div className={styles.rowLabel}>Bank name</div>
                <div className={styles.rowValue}>{bank.bankName}</div>
                <button
                  type="button"
                  className={styles.copy}
                  onClick={() => onCopy("Bank name", bank.bankName)}
                >
                  {copied === "Bank name" ? "Copied" : "Copy"}
                </button>
              </div>

              <div className={styles.row}>
                <div className={styles.rowLabel}>IBAN</div>
                <div className={styles.rowValue}>{bank.iban}</div>
                <button
                  type="button"
                  className={styles.copy}
                  onClick={() => onCopy("IBAN", bank.iban)}
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
                  onClick={() =>
                    data?.reference && onCopy("Reference", data.reference)
                  }
                >
                  {copied === "Reference" ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          )}

          {paymentMethod === "other" && (
            <div className={styles.block}>
              <div className={styles.blockTitle}>{otherPayment.title}</div>

              <p className={styles.stepText}>{otherPayment.instruction}</p>

              <div className={styles.row}>
                <div className={styles.rowLabel}>WhatsApp</div>
                <div className={styles.rowValue}>{otherPayment.whatsapp}</div>
                <button
                  type="button"
                  className={styles.copy}
                  onClick={() => onCopy("WhatsApp", otherPayment.whatsapp)}
                >
                  {copied === "WhatsApp" ? "Copied" : "Copy"}
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
                  onClick={() =>
                    data?.reference && onCopy("Reference", data.reference)
                  }
                >
                  {copied === "Reference" ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          )}

          {paymentMethod !== "stripe" && (
            <div className={styles.ctaWrap}>
              <Link
                className={`${styles.cta} ${
                  !data?.orderId ? styles.ctaDisabled : ""
                }`}
                href={
                  data?.orderId
                    ? `/checkout/upload-proof?orderId=${data.orderId}`
                    : "#"
                }
                aria-disabled={!data?.orderId}
                onClick={(e) => {
                  if (!data?.orderId) e.preventDefault();
                }}
              >
                Upload payment proof
              </Link>

              <button
                type="button"
                className={styles.refresh}
                onClick={createOrder}
                disabled={loading}
                aria-busy={loading}
                style={{ width: "100%", marginTop: 10 }}
              >
                {loading ? "Generating…" : "Regenerate reference"}
              </button>

              <div className={styles.small}>
                After upload, your status becomes <b>Waiting approval</b>.
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}