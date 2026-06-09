import Shell from "@/components/Shell";

export default function SupportPage() {
  return (
    <Shell>
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
        <h1>Support</h1>

        <h2>Payment Proof</h2>
        <p>
          If you paid manually, upload your payment proof from the checkout page.
          Our team will review it and approve your access.
        </p>

        <h2>Consultation Access</h2>
        <p>
          After payment approval, your consultation form will become available.
          Complete the questionnaire and upload clear photos for review.
        </p>

        <h2>Photo Upload Tips</h2>
        <p>
          Upload clear photos in natural light. Avoid filters, heavy makeup, or
          blurry images so we can better understand your skin concern.
        </p>

        <h2>Course Access</h2>
        <p>
          Once your course payment is approved, your course access will be
          activated automatically by admin approval.
        </p>

        <h2>Results</h2>
        <p>
          When your consultation result is ready, you will receive an email and
          can view your plan from your dashboard.
        </p>

        <h2>Need Help?</h2>
        <p>
          Contact us at support@melauzuri.com for help with your account,
          payment, consultation, or course access.
        </p>
      </main>
    </Shell>
  );
}