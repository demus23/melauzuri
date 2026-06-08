import mongoose, { Schema, models, model } from "mongoose";

const OrderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String, required: true },              // snapshot
    image: { type: String },                              // snapshot
    qty: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },  // snapshot
    vendorId: { type: Schema.Types.ObjectId, ref: "User" } // for vendor orders later
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },

    items: { type: [OrderItemSchema], required: true },

    subtotal: { type: Number, required: true, min: 0 },
    shipping: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"],
      default: "pending",
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "failed", "refunded"],
      default: "unpaid",
      index: true,
    },

    paymentRef: { type: String }, // Stripe PI / Checkout Session / manual ref, etc.

    shippingAddress: {
      fullName: String,
      phone: String,
      address1: String,
      address2: String,
      city: String,
      country: String,
      postalCode: String,
    },

    notes: { type: String },
  },
  { timestamps: true }
);

export default models.Order || model("Order", OrderSchema);
