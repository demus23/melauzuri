import ConsultationCase from "@/lib/models/ConsultationCase";

export default async function getOrCreateConsultation(userId: string) {
  const consultationCase = await ConsultationCase.findOne({
    userId,
    status: { $in: ["pending_intake", "active"] },
  }).sort({ createdAt: -1 });

  if (!consultationCase) {
    throw new Error("No active consultation case found for this user.");
  }

  return consultationCase;
}