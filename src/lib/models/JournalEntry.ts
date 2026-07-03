import mongoose, { Schema, models, model } from "mongoose";

const JournalEntrySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    photoUrl: {
      type: String,
      default: null,
    },
    note: {
      type: String,
      default: "",
      maxlength: 1000,
    },
    feeling: {
      type: String,
      enum: ["great", "okay", "irritated", "flare-up"],
      required: true,
    },
  },
  { timestamps: true }
);

JournalEntrySchema.index({ userId: 1, createdAt: -1 });

const JournalEntry =
  models.JournalEntry || model("JournalEntry", JournalEntrySchema);

export default JournalEntry;