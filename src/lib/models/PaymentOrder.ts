import mongoose, { Schema, models, model } from "mongoose";

export type OrderStatus = "created" | "pending" | "approved" | "rejected";

const PaymentOrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: String, enum: ["course", "consultation", "bundle"], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },

    reference: { type: String, unique: true, required: true },
    status: { type: String, enum: ["created", "pending", "approved", "rejected"], default: "created" },

    proofUrl: { type: String, default: "" },
    adminNote: { type: String, default: "" },

    approvedAt: { type: Date },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    rejectedAt: { type: Date },
    rejectedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default models.PaymentOrder || model("PaymentOrder", PaymentOrderSchema);
