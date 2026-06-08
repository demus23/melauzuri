import { redirect } from "next/navigation";
import { Types } from "mongoose";
import dbConnect from "@/lib/mongoose";
import { requireAccess } from "@/lib/requireAccess";
import UserLessonProgress from "@/lib/models/UserLessonProgress";

export async function POST(req: Request) {
  const user = await requireAccess("course");
  await dbConnect();

  const formData = await req.formData();

  const courseId = String(formData.get("courseId") || "");
  const lessonId = String(formData.get("lessonId") || "");
  const courseSlug = String(formData.get("courseSlug") || "");

  if (!Types.ObjectId.isValid(courseId) || !Types.ObjectId.isValid(lessonId)) {
    redirect("/courses");
  }

  await UserLessonProgress.findOneAndUpdate(
    {
      userId: user._id,
      courseId,
      lessonId,
    },
    {
      $set: {
        completed: true,
        completedAt: new Date(),
        lastViewedAt: new Date(),
      },
    },
    {
      upsert: true,
      new: true,
    }
  );

  redirect(`/courses/${courseSlug}`);
}