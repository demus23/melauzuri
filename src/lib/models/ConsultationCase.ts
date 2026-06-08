import mongoose, { Schema, models, model, Document } from "mongoose";

export interface IConsultationCase extends Document {
  userId: mongoose.Types.ObjectId;
  paymentOrderId: mongoose.Types.ObjectId;
  reference: string;

  status: "pending_intake" | "active" | "completed" | "cancelled";
  intakeCompleted: boolean;
  photosUploaded: boolean;

  basicInfo?: {
    fullName?: string;
    ageRange?: string;
  };

  skinProfile?: {
    skinType?: string;
    sensitivity?: string;
    mainConcern?: string;
    otherConcerns?: string;
  };

  routine?: {
    amRoutine?: string;
    pmRoutine?: string;
    activeIngredients?: string;
  };

  history?: {
    duration?: string;
    pregnant?: string;
    historyNotes?: string;
  };

  photos?: string[];

  result?: {
    summary?: string;
    morningRoutine?: string;
    nightRoutine?: string;
    productsToAvoid?: string;
    professionalAdvice?: string;
    followUpNote?: string;
    deliveredAt?: Date;
  };

  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ConsultationCaseSchema = new Schema<IConsultationCase>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    paymentOrderId: {
      type: Schema.Types.ObjectId,
      ref: "PaymentOrder",
      required: true,
      unique: true,
      index: true,
    },

    reference: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["pending_intake", "active", "completed", "cancelled"],
      default: "pending_intake",
      index: true,
    },

    intakeCompleted: {
      type: Boolean,
      default: false,
    },

    photosUploaded: {
      type: Boolean,
      default: false,
    },

    basicInfo: {
      fullName: { type: String, trim: true, default: "" },
      ageRange: { type: String, trim: true, default: "" },
    },

    skinProfile: {
      skinType: { type: String, trim: true, default: "" },
      sensitivity: { type: String, trim: true, default: "" },
      mainConcern: { type: String, trim: true, default: "" },
      otherConcerns: { type: String, trim: true, default: "" },
    },

    routine: {
      amRoutine: { type: String, trim: true, default: "" },
      pmRoutine: { type: String, trim: true, default: "" },
      activeIngredients: { type: String, trim: true, default: "" },
    },

    history: {
      duration: { type: String, trim: true, default: "" },
      pregnant: { type: String, trim: true, default: "" },
      historyNotes: { type: String, trim: true, default: "" },
    },

    photos: {
      type: [String],
      default: [],
    },

    result: {
      summary: { type: String, default: "" },
      morningRoutine: { type: String, default: "" },
      nightRoutine: { type: String, default: "" },
      productsToAvoid: { type: String, default: "" },
      professionalAdvice: { type: String, default: "" },
      followUpNote: { type: String, default: "" },
      deliveredAt: { type: Date },
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const ConsultationCase =
  models.ConsultationCase ||
  model<IConsultationCase>("ConsultationCase", ConsultationCaseSchema);

export default ConsultationCase;