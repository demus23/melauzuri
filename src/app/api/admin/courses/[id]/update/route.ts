import { redirect } from "next/navigation";
import { Types } from "mongoose";
import dbConnect from "@/lib/mongoose";
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

  const formData = await req.formData();

  await Course.findByIdAndUpdate(id, {
    $set: {
      title: String(formData.get("title") || ""),
      slug: cleanSlug(String(formData.get("slug") || "")),
      description: String(formData.get("description") || ""),
      thumbnailUrl: String(formData.get("thumbnailUrl") || ""),
      category: String(formData.get("category") || ""),
      level: String(formData.get("level") || "beginner"),
      order: Number(formData.get("order") || 0),
      isPublished: formData.get("isPublished") === "true",
    },
  });

  redirect(`/admin/courses/${id}`);
}