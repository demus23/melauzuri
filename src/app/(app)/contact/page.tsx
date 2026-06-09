import Shell from "@/components/Shell";

export default function ContactPage() {
  return (
    <Shell>
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
        <h1>Contact Us</h1>

        <p>
          Have a question about consultations, courses, payment approval, or your
          skincare result? We are here to help.
        </p>

        <h2>Email</h2>
        <p>support@melauzuri.com</p>

        <h2>Support Topics</h2>
        <ul>
          <li>Consultation access</li>
          <li>Payment proof approval</li>
          <li>Course access</li>
          <li>Technical login issues</li>
          <li>General skincare consultation questions</li>
        </ul>

        <h2>Response Time</h2>
        <p>
          We aim to respond as soon as possible. During busy periods, replies may
          take longer.
        </p>
      </main>
    </Shell>
  );
}