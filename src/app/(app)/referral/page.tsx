import Shell from "@/components/Shell";
import { requireAccess } from "@/lib/requireAccess";
import dbConnect from "@/lib/mongoose";
import Referral from "@/lib/models/Referral";
import { generateReferralCode } from "@/lib/generateReferralCode";
import styles from "./referral.module.css";
import ReferralLinkCopy from "./ReferralLinkCopy";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://melazuri.com";
const REFERRER_REWARD = 25; // AED
const REFEREE_DISCOUNT = 15; // AED

export default async function ReferralPage() {
  const user = await requireAccess("referral");
  await dbConnect();

  // Find or create referral record for this user
  let referral = await Referral.findOne({ referrerId: user._id }).lean();

  if (!referral) {
    const code = await generateReferralCode();
    referral = await Referral.create({
      referrerId: user._id,
      code,
      uses: [],
      rewards: [],
    });
    referral = referral.toObject();
  }

  const referralUrl = `${SITE_URL}/ref/${referral.code}`;
  const totalUses = referral.uses?.length ?? 0;
  const qualifiedUses =
    referral.uses?.filter((u: any) => u.purchased).length ?? 0;
  const pendingRewards =
    referral.rewards?.filter((r: any) => r.status === "pending").length ?? 0;
  const appliedRewards =
    referral.rewards?.filter((r: any) => r.status === "applied").length ?? 0;
  const totalEarned = appliedRewards * REFERRER_REWARD;

  return (
    <Shell>
      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.badge}>Refer a friend</div>
          <h1 className={styles.h1}>Earn AED {REFERRER_REWARD} for every referral</h1>
          <p className={styles.p}>
            Share your link with friends. When they make their first purchase,
            you get AED {REFERRER_REWARD} off your next consultation or course —
            and they get AED {REFEREE_DISCOUNT} off theirs.
          </p>
        </section>

        {/* Referral link card */}
        <div className={styles.linkCard}>
          <div className={styles.linkCardLabel}>Your referral link</div>
          <ReferralLinkCopy url={referralUrl} code={referral.code} />
          <p className={styles.linkNote}>
            Anyone who signs up and purchases using this link qualifies. Rewards
            are applied manually by our team — usually within 48 hours of a
            qualifying purchase.
          </p>
        </div>

        {/* Stats row */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statNum}>{totalUses}</div>
            <div className={styles.statLabel}>Link clicks / signups</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNum}>{qualifiedUses}</div>
            <div className={styles.statLabel}>Qualifying purchases</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNum}>{pendingRewards}</div>
            <div className={styles.statLabel}>Rewards pending</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNum}>AED {totalEarned}</div>
            <div className={styles.statLabel}>Total earned</div>
          </div>
        </div>

        {/* How it works */}
        <section className={styles.section}>
          <h2 className={styles.h2}>How it works</h2>
          <div className={styles.stepsGrid}>
            {[
              {
                num: "1",
                title: "Share your link",
                desc: `Send your unique referral link to friends or share it on social media. They get AED ${REFEREE_DISCOUNT} off their first purchase automatically.`,
              },
              {
                num: "2",
                title: "They purchase",
                desc: "When they complete their first consultation, course, or bundle, the referral is logged automatically.",
              },
              {
                num: "3",
                title: "You get rewarded",
                desc: `Our team applies AED ${REFERRER_REWARD} credit to your account within 48 hours. Contact support to redeem it on your next purchase.`,
              },
            ].map((s) => (
              <div key={s.num} className={styles.stepCard}>
                <div className={styles.stepNum}>{s.num}</div>
                <div className={styles.stepTitle}>{s.title}</div>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pending reward notice */}
        {pendingRewards > 0 && (
          <div className={styles.rewardNotice}>
            <span className={styles.rewardIcon}>🎉</span>
            <div>
              <div className={styles.rewardTitle}>
                You have {pendingRewards} reward{pendingRewards > 1 ? "s" : ""} pending
              </div>
              <p className={styles.rewardDesc}>
                AED {pendingRewards * REFERRER_REWARD} is waiting to be applied
                to your next purchase. Contact{" "}
                <a href="/support" className={styles.rewardLink}>
                  support
                </a>{" "}
                to redeem it.
              </p>
            </div>
          </div>
        )}

        {/* Terms */}
        <p className={styles.terms}>
          Rewards apply to consultations and courses only. One reward per
          qualifying referral. Melazuri reserves the right to adjust or
          discontinue the referral program at any time. Reward credits cannot be
          exchanged for cash.
        </p>
      </div>
    </Shell>
  );
}