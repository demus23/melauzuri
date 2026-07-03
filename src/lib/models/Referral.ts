// src/lib/models/Referral.ts
import mongoose, { Schema, models, model } from "mongoose";

const ReferralSchema = new Schema(
  {
    // The user who owns this referral code
    referrerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Short unique code e.g. "ABC123"
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    // People who signed up using this code
    uses: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        email: { type: String },
        usedAt: { type: Date, default: Date.now },
        // Whether they completed a purchase (manually set by support/admin)
        purchased: { type: Boolean, default: false },
        purchasedAt: { type: Date, default: null },
      },
    ],
    // Rewards earned by the referrer (one per qualifying use)
    rewards: [
      {
        // Which use triggered this reward
        forUserId: { type: Schema.Types.ObjectId, ref: "User" },
        amount: { type: Number, default: 25 }, // AED
        status: {
          type: String,
          enum: ["pending", "applied", "expired"],
          default: "pending",
        },
        appliedAt: { type: Date, default: null },
        note: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

const Referral = models.Referral || model("Referral", ReferralSchema);

export default Referral;