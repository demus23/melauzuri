import mongoose, { Schema, models, model } from "mongoose";

export type ProductType = "course" | "consultation" | "bundle";
export type PaymentMethod = "stripe" | "bank_transfer" | "other";
export type OrderStatus = "created" | "pending" | "paid" | "approved" | "rejected";

const PaymentOrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    product: {
      type: String,
      enum: ["course", "consultation", "bundle"],
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["stripe", "bank_transfer", "other"],
      default: "bank_transfer",
    },

    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },

    dermatologistFee: { type: Number, default: 0 },
    consultationRequiresDermatologist: { type: Boolean, default: false },
    totalAmount: { type: Number, required: true },

    reference: { type: String, unique: true, required: true },

    status: {
  type: String,
  enum: [
    "created",
    "awaiting_payment",
    "processing",
    "completed",
    "cancelled",
  ],
  default: "awaiting_payment",
},

   paymentStatus: {
  type: String,
  enum: [
    "pending",
    "paid",
    "approved",
    "rejected",
  ],
  default: "pending",
},

    stripeSessionId: { type: String, default: "" },
    stripePaymentIntentId: { type: String, default: "" },

    proofUrl: { type: String, default: "" },
    adminNote: { type: String, default: "" },

    paidAt: {
  type: Date,
},
proofUploadedAt: {
  type: Date,
},

    approvedAt: { type: Date },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },

    rejectedAt: { type: Date },
    rejectedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default models.PaymentOrder ||
  model("PaymentOrder", PaymentOrderSchema);