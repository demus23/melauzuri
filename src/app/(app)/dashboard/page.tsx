"use client";

import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Shell from "@/components/Shell";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  const { data, status } = useSession();

  const role = (data?.user as any)?.role;
  const hasCourse = Boolean((data?.user as any)?.hasCourseAccess);
  const hasConsult = Boolean((data?.user as any)?.hasConsultationAccess);

  const email = data?.user?.email ?? "your account";

  return (
    <Shell>
      <div className={styles.wrap}>
        {/* Header */}
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.h1}>Dashboard</h1>
            <p className={styles.sub}>
              Manage your access, book consultations, and continue your learning.
            </p>
          </div>

          <div className={styles.topActions}>
            <Link href="/admin" className={styles.btnGhost}>
  Admin dashboard
</Link>
            <Link className={styles.btnGhost} href="/payments/status">
              Payment status
            </Link>
            {status === "authenticated" && (
              <button
                className={styles.btnGhost}
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Logout
              </button>
            )}
          </div>
        </div>

        {/* Loading */}
        {status === "loading" && (
          <div className={styles.card}>
            <div className={styles.skeletonTitle} />
            <div className={styles.skeletonLine} />
            <div className={styles.skeletonLine} />
          </div>
        )}

        {/* Not logged in */}
        {status === "unauthenticated" && (
          <div className={styles.grid}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.h2}>You’re not logged in</h2>
                <span className={styles.kicker}>Account</span>
              </div>
              <p className={styles.muted}>
                Log in to see your course access and booking options.
              </p>

              <div className={styles.row}>
                <Link className={styles.btnPrimary} href="/login">
                  Log in
                </Link>
                <Link className={styles.btn} href="/register">
                  Create account
                </Link>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.h2}>What you get</h2>
                <span className={styles.kicker}>Melazuri</span>
              </div>

              <ul className={styles.list}>
                <li>Barrier-first routines designed for deeper skin tones</li>
                <li>Pigmentation-aware protocols and ingredient guidance</li>
                <li>Consultations when you’re approved and ready</li>
              </ul>

              <div className={styles.row}>
                <Link className={styles.btnPrimary} href="/pricing">
                  View pricing
                </Link>
                <Link className={styles.btn} href="/support">
                  Ask support
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Authenticated */}
        {status === "authenticated" && (
          <>
            <div className={styles.welcome}>
              <div className={styles.welcomeLeft}>
                <div className={styles.avatar} aria-hidden="true">
                  {email.slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <div className={styles.welcomeTitle}>
                    Welcome back, <span className={styles.email}>{email}</span>
                    {role === "admin" ? (
                      <span className={styles.adminPill}>Admin</span>
                    ) : null}
                  </div>
                  <div className={styles.welcomeMeta}>
                    Keep going — small consistent steps give the best skin results.
                  </div>
                </div>
              </div>

              <div className={styles.welcomeRight}>
                <Link className={styles.btnPrimary} href="/pricing">
                  Get access
                </Link>

                {hasCourse ? (
                  <Link className={styles.btn} href="/course">
                    Go to course
                  </Link>
                ) : (
                  <Link className={styles.btn} href="/pricing">
                    Unlock course
                  </Link>
                )}

                {hasConsult ? (
                  <Link className={styles.btn} href="/consultations">
                    Book consultation
                  </Link>
                ) : (
                  <Link className={styles.btn} href="/pricing">
                    Unlock consultation
                  </Link>
                )}
              </div>
            </div>

            <div className={styles.grid}>
              {/* Access cards */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.h2}>Your access</h2>
                  <span className={styles.kicker}>Status</span>
                </div>

                <div className={styles.statusGrid}>
                  <div className={styles.statusItem}>
                    <div className={styles.statusLeft}>
                      <div className={styles.statusTitle}>Course access</div>
                      <div className={styles.small}>
                        Unlock modules after approval.
                      </div>
                    </div>
                    <span
                      className={`${styles.pill} ${
                        hasCourse ? styles.ok : styles.no
                      }`}
                    >
                      {hasCourse ? "ACTIVE" : "LOCKED"}
                    </span>
                  </div>

                  <div className={styles.statusItem}>
                    <div className={styles.statusLeft}>
                      <div className={styles.statusTitle}>Consultation</div>
                      <div className={styles.small}>
                        Book once approved.
                      </div>
                    </div>
                    <span
                      className={`${styles.pill} ${
                        hasConsult ? styles.ok : styles.no
                      }`}
                    >
                      {hasConsult ? "ACTIVE" : "LOCKED"}
                    </span>
                  </div>
                </div>

                <div className={styles.row}>
                  <Link className={styles.btnPrimary} href="/pricing">
                    Upgrade / Unlock
                  </Link>
                  <Link className={styles.btn} href="/support">
                    Need help?
                  </Link>

                  {role === "admin" && (
                   <Link href="/admin" className={styles.secondaryBtn}>
                     Admin dashboard
                   </Link>
                  )}
                </div>
              </div>

              {/* Next steps */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.h2}>Next steps</h2>
                  <span className={styles.kicker}>Activation</span>
                </div>

                <div className={styles.stepper}>
                  <div className={styles.step}>
                    <span className={styles.stepDot} aria-hidden="true" />
                    <div>
                      <div className={styles.stepTitle}>Choose a plan</div>
                      <div className={styles.small}>Course, consultation, or bundle.</div>
                    </div>
                  </div>

                  <div className={styles.step}>
                    <span className={styles.stepDot} aria-hidden="true" />
                    <div>
                      <div className={styles.stepTitle}>Pay via Wise</div>
                      <div className={styles.small}>Use your reference code.</div>
                    </div>
                  </div>

                  <div className={styles.step}>
                    <span className={styles.stepDot} aria-hidden="true" />
                    <div>
                      <div className={styles.stepTitle}>Upload proof</div>
                      <div className={styles.small}>We verify and approve.</div>
                    </div>
                  </div>

                  <div className={styles.step}>
                    <span className={styles.stepDot} aria-hidden="true" />
                    <div>
                      <div className={styles.stepTitle}>Access activated</div>
                      <div className={styles.small}>You’ll see ACTIVE in your dashboard.</div>
                    </div>
                  </div>
                </div>

                <div className={styles.row}>
                  <Link
                    className={styles.btnPrimary}
                    href="/checkout/manual?product=bundle"
                  >
                    Start bundle
                  </Link>
                  <Link
                    className={styles.btn}
                    href="/checkout/manual?product=course"
                  >
                    Course only
                  </Link>
                </div>

                <div className={styles.tip}>
                  Tip: Add your reference code in Wise notes so approval is faster.
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Shell>
  );
}