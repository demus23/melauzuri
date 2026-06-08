import mongoose, { Schema, models, model, Document } from "mongoose";

export interface ILesson extends Document {
  courseId: mongoose.Types.ObjectId;
  moduleTitle: string;
  title: string;
  slug: string;
  description?: string;
  videoUrl?: string;
  content?: string;
  durationMinutes?: number;
  order: number;
  isPreview: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    moduleTitle: {
      type: String,
      required: true,
      trim: true,
      default: "Module 1",
    },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    description: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    content: { type: String, default: "" },
    durationMinutes: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
    isPreview: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

LessonSchema.index({ courseId: 1, slug: 1 }, { unique: true });
LessonSchema.index({ courseId: 1, moduleTitle: 1, order: 1 });

const Lesson =
  models.Lesson || model<ILesson>("Lesson", LessonSchema);

export default Lesson;