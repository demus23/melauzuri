import mongoose, { Schema, models, model, Document } from "mongoose";

export interface IUserLessonProgress extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  lessonId: mongoose.Types.ObjectId;
  completed: boolean;
  completedAt?: Date;
  lastViewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserLessonProgressSchema = new Schema<IUserLessonProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
      index: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    lastViewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

UserLessonProgressSchema.index(
  { userId: 1, lessonId: 1 },
  { unique: true }
);

const UserLessonProgress =
  models.UserLessonProgress ||
  model<IUserLessonProgress>("UserLessonProgress", UserLessonProgressSchema);

export default UserLessonProgress;