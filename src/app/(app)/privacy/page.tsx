import Shell from "@/components/Shell";

export default function PrivacyPage() {
  return (
    <Shell>
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
        <h1>Privacy Policy</h1>
        <p>Last updated: 2026</p>

        <h2>1. Information We Collect</h2>
        <p>
          We may collect your name, email address, phone number, consultation
          answers, skin concerns, routine details, uploaded photos, payment proof,
          and course activity.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>
          We use your information to provide skincare consultations, manage your
          account, approve payments, grant course access, deliver results, improve
          our services, and communicate with you.
        </p>

        <h2>3. Skin Photos and Consultation Data</h2>
        <p>
          Uploaded photos and consultation information are used only to review
          your case and prepare your skincare guidance. We do not sell your
          personal consultation data.
        </p>

        <h2>4. Payment Information</h2>
        <p>
          Manual payment proof may be reviewed by our admin team. We do not store
          full card details on our platform.
        </p>

        <h2>5. Cloud Storage</h2>
        <p>
          Uploaded images and payment proof may be stored securely using trusted
          cloud storage services such as Cloudinary or similar providers.
        </p>

        <h2>6. Email Communication</h2>
        <p>
          We may email you about payment approval, consultation submission,
          results availability, course access, and important account updates.
        </p>

        <h2>7. Data Security</h2>
        <p>
          We take reasonable steps to protect your information, but no online
          system can be guaranteed to be completely secure.
        </p>

        <h2>8. Your Rights</h2>
        <p>
          You may request access, correction, or deletion of your personal data by
          contacting us.
        </p>

        <h2>9. Contact</h2>
        <p>
          For privacy questions, please contact us through the Contact page.
        </p>
      </main>
    </Shell>
  );
}