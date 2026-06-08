import { redirect } from "next/navigation";
import { Types } from "mongoose";
import dbConnect from "@/lib/mongoose";
import Lesson from "@/lib/models/Lesson";
import Course from "@/lib/models/Course";
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

  const course = await Course.findById(id).lean();

  if (!course) {
    redirect("/admin/courses");
  }

  const formData = await req.formData();

  const title = String(formData.get("title") || "");
  const slug = cleanSlug(String(formData.get("slug") || title));

  await Lesson.create({
    courseId: id,
    moduleTitle: String(formData.get("moduleTitle") || "Module 1"),
    title,
    slug,
    description: String(formData.get("description") || ""),
    videoUrl: String(formData.get("videoUrl") || ""),
    content: String(formData.get("content") || ""),
    durationMinutes: Number(formData.get("durationMinutes") || 0),
    order: Number(formData.get("order") || 0),
    isPreview: formData.get("isPreview") === "true",
    isPublished: formData.get("isPublished") === "true",
  });

  redirect(`/admin/courses/${id}`);
}