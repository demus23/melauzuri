// src/lib/requireAccess.ts
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/models/User";

type AccessType = "course" | "consultation" | "journal" | "referral" | "admin";

export async function requireAccess(type: AccessType) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  await dbConnect();

  const user = await User.findOne({
    email: session.user.email.toLowerCase(),
  }).lean();

  if (!user) redirect("/login");

  // Admin access
  if (type === "admin") {
    if (user.role !== "admin") redirect("/");
    return user;
  }

  // Journal + referral: available to any paying user
  if (type === "journal" || type === "referral") {
    const hasAnyAccess =
      Boolean(user.hasCourseAccess) || Boolean(user.hasConsultationAccess);
    if (!hasAnyAccess) redirect("/pricing");
    return user;
  }

  // Course / consultation
  const ok =
    type === "course"
      ? Boolean(user.hasCourseAccess)
      : Boolean(user.hasConsultationAccess);

  if (!ok) redirect("/pricing");

  return user;
}