import Link from "next/link";
import Shell from "@/components/Shell";
import styles from "./success.module.css";

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams?: {
    orderId?: string;
  };
}) {
  const orderId = searchParams?.orderId;

  return (
    <Shell>
      <div className={styles.page}>
        <section className={styles.card}>
          <div className={styles.icon}>✓</div>

          <div className={styles.badge}>Payment successful</div>

          <h1 className={styles.h1}>Thank you for your payment</h1>

          <p className={styles.text}>
            Your Melazuri access is being prepared. If you paid by Stripe, your
            access should activate automatically shortly.
          </p>

          {orderId && (
            <div className={styles.reference}>
              <span>Order ID</span>
              <strong>{orderId}</strong>
            </div>
          )}

          <div className={styles.actions}>
            <Link href="/consultation" className={styles.primary}>
              Go to consultation
            </Link>

            <Link href="/courses" className={styles.secondary}>
              View courses
            </Link>
          </div>

          <p className={styles.small}>
            If your access does not appear immediately, please refresh after a
            few moments or contact support.
          </p>
        </section>
      </div>
    </Shell>
  );
}