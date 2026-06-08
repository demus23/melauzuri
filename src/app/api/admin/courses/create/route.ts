import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongoose";
import Course from "@/lib/models/Course";
import { requireAccess } from "@/lib/requireAccess";

function cleanSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(req: Request) {
  await requireAccess("admin");
  await dbConnect();

  const formData = await req.formData();

  const title = String(formData.get("title") || "");
  const slug = cleanSlug(String(formData.get("slug") || title));

  const course = await Course.create({
    title,
    slug,
    description: String(formData.get("description") || ""),
    thumbnailUrl: String(formData.get("thumbnailUrl") || ""),
    category: String(formData.get("category") || ""),
    level: String(formData.get("level") || "beginner"),
    isPublished: formData.get("isPublished") === "true",
  });

  redirect(`/admin/courses/${course._id}`);
}