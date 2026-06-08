import mongoose, { Schema, models, model, Document } from "mongoose";

export interface ICourse extends Document {
  title: string;
  slug: string;
  description?: string;
  thumbnailUrl?: string;
  category?: string;
  level?: "beginner" | "intermediate" | "advanced";
  isPublished: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, default: "" },
    thumbnailUrl: { type: String, default: "" },
    category: { type: String, default: "" },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    isPublished: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Course =
  models.Course || model<ICourse>("Course", CourseSchema);

export default Course;