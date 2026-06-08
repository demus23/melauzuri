import { redirect } from "next/navigation";
import { Types } from "mongoose";
import dbConnect from "@/lib/mongoose";
import Lesson from "@/lib/models/Lesson";
import { requireAccess } from "@/lib/requireAccess";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function cleanSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(req: Request, { params }: RouteContext) {
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

  const formData = await req.formData();

  lesson.moduleTitle = String(formData.get("moduleTitle") || "Module 1");
  lesson.title = String(formData.get("title") || "");
  lesson.slug = cleanSlug(String(formData.get("slug") || lesson.title));
  lesson.description = String(formData.get("description") || "");
  lesson.videoUrl = String(formData.get("videoUrl") || "");
  lesson.content = String(formData.get("content") || "");
  lesson.durationMinutes = Number(formData.get("durationMinutes") || 0);
  lesson.order = Number(formData.get("order") || 0);
  lesson.isPreview = formData.get("isPreview") === "true";
  lesson.isPublished = formData.get("isPublished") === "true";

  await lesson.save();

  redirect(`/admin/courses/${lesson.courseId}`);
}