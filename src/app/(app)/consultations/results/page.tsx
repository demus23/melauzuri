import Shell from "@/components/Shell";
import { requireAccess } from "@/lib/requireAccess";
import dbConnect from "@/lib/mongoose";
import ConsultationCase from "@/lib/models/ConsultationCase";
import Link from "next/link";

export default async function ConsultationResultsPage() {
  const user = await requireAccess("consultation");
  await dbConnect();

  const consultation = await ConsultationCase.findOne({
    userId: user._id,
    status: "completed",
  })
    .sort({ completedAt: -1, createdAt: -1 })
    .lean();

  if (!consultation || !consultation.result) {
    return (
      <Shell>
        <div style={{ padding: 24 }}>
          <h1>Your results are not ready yet</h1>
          <p>Your skincare plan will appear here once your consultation is completed.</p>
          <Link href="/consultations/status">Back to status</Link>
        </div>
      </Shell>
    );
  }

  const result = consultation.result;

  return (
    <Shell>
      <div style={{ padding: 24, display: "grid", gap: 20 }}>
        <div>
          <h1>Your Personalized Skincare Plan</h1>
          <p>Reference: {consultation.reference}</p>
        </div>

        <section>
          <h2>Summary</h2>
          <p>{result.summary || "—"}</p>
        </section>

        <section>
          <h2>Morning Routine</h2>
          <p>{result.morningRoutine || "—"}</p>
        </section>

        <section>
          <h2>Night Routine</h2>
          <p>{result.nightRoutine || "—"}</p>
        </section>

        <section>
          <h2>Products / Ingredients to Avoid</h2>
          <p>{result.productsToAvoid || "—"}</p>
        </section>

        <section>
          <h2>Professional Advice</h2>
          <p>{result.professionalAdvice || "—"}</p>
        </section>

        <section>
          <h2>Follow-up Note</h2>
          <p>{result.followUpNote || "—"}</p>
        </section>
      </div>
    </Shell>
  );
}