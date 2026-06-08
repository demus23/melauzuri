import mongoose, { Schema, models, model, Document } from "mongoose";

export interface IConsultation extends Document {
  user?: mongoose.Types.ObjectId | null;
  fullName: string;
  email: string;
  phone?: string;
  concern?: string;
  message?: string;
  status: "new" | "reviewing" | "booked" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const ConsultationSchema = new Schema<IConsultation>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    concern: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["new", "reviewing", "booked", "completed", "cancelled"],
      default: "new",
    },
  },
  { timestamps: true }
);

const Consultation =
  models.Consultation || model<IConsultation>("Consultation", ConsultationSchema);

export default Consultation;