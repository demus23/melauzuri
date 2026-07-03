// src/lib/generateReferralCode.ts
import Referral from "@/lib/models/Referral";

/**
 * Generates a short 6-character alphanumeric referral code
 * guaranteed unique within the Referral collection.
 */
export async function generateReferralCode(): Promise<string> {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no O/0/1/I to avoid confusion
  const length = 6;
  let attempts = 0;

  while (attempts < 10) {
    let code = "";
    for (let i = 0; i < length; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }

    const existing = await Referral.findOne({ code });
    if (!existing) return code;
    attempts++;
  }

  // Fallback: extend to 8 chars if collisions somehow persist
  let code = "";
  const chars8 = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (let i = 0; i < 8; i++) {
    code += chars8[Math.floor(Math.random() * chars8.length)];
  }
  return code;
}