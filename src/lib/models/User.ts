//src\lib\models\User.ts
import mongoose, { Schema, models, model } from "mongoose";

export type UserRole = "user" | "admin";

const UserSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, unique: true, required: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },

    // Access flags (MVP)
    hasCourseAccess: { type: Boolean, default: false },
    hasConsultationAccess: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.User || model("User", UserSchema);
