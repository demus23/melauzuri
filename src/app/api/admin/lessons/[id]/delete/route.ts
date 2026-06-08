import { redirect } from "next/navigation";
import { Types } from "mongoose";
import dbConnect from "@/lib/mongoose";
import Lesson from "@/lib/models/Lesson";
import UserLessonProgress from "@/lib/models/UserLessonProgress";
import { requireAccess } from "@/lib/requireAccess";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_req: Request, { params }: RouteContext) {
  await requireAccess("admin");
  await dbConnect();

  const { id } = await params;

  if (!Types.ObjectId.isValid(id)) {
    redirect("/admin/courses");
  }

  const lesson = await Lesson.findById(id);

  if (!lesson) {
    redirect("/admin/courses");
  }

  const courseId = String(lesson.courseId);

  await UserLessonProgress.deleteMany({ lessonId: lesson._id });
  await Lesson.findByIdAndDelete(lesson._id);

  redirect(`/admin/courses/${courseId}`);
}