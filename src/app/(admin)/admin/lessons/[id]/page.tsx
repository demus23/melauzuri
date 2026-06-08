import Shell from "@/components/Shell";
import { requireAccess } from "@/lib/requireAccess";
import dbConnect from "@/lib/mongoose";
import Lesson from "@/lib/models/Lesson";
import Course from "@/lib/models/Course";
import { notFound } from "next/navigation";
import { Types } from "mongoose";
import Link from "next/link";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminLessonEditorPage({ params }: PageProps) {
  await requireAccess("admin");
  await dbConnect();

  const { id } = await params;

  if (!Types.ObjectId.isValid(id)) notFound();

  const lesson = await Lesson.findById(id).lean();
  if (!lesson) notFound();

  const course = await Course.findById(lesson.courseId).lean();
  if (!course) notFound();

  return (
    <Shell>
      <main style={{ padding: 24 }}>
        <Link href={`/admin/courses/${course._id}`}>← Back to course editor</Link>

        <h1>Edit Lesson</h1>
        <p>
          Course: <strong>{course.title}</strong>
        </p>

        <form
          action={`/api/admin/lessons/${lesson._id}/update`}
          method="POST"
          style={{ display: "grid", gap: 14, maxWidth: 760, marginTop: 24 }}
        >
          <input name="moduleTitle" defaultValue={lesson.moduleTitle} required />
          <input name="title" defaultValue={lesson.title} required />
          <input name="slug" defaultValue={lesson.slug} required />

          <textarea
            name="description"
            defaultValue={lesson.description || ""}
            rows={3}
            placeholder="Lesson description"
          />

          <input
            name="videoUrl"
            defaultValue={lesson.videoUrl || ""}
            placeholder="Video URL"
          />

          <textarea
            name="content"
            defaultValue={lesson.content || ""}
            rows={8}
            placeholder="Lesson notes/content"
          />

          <input
            name="durationMinutes"
            type="number"
            defaultValue={lesson.durationMinutes || 0}
            placeholder="Duration minutes"
          />

          <input
            name="order"
            type="number"
            defaultValue={lesson.order || 0}
            placeholder="Lesson order"
          />

          <label>
            <input
              type="checkbox"
              name="isPreview"
              value="true"
              defaultChecked={Boolean(lesson.isPreview)}
            />{" "}
            Preview lesson
          </label>

          <label>
            <input
              type="checkbox"
              name="isPublished"
              value="true"
              defaultChecked={Boolean(lesson.isPublished)}
            />{" "}
            Published
          </label>

          <div style={{ display: "flex", gap: 12 }}>
            <button type="submit">Save lesson</button>

            <a
              href={`/courses/${course.slug}/lessons/${lesson.slug}`}
              target="_blank"
              rel="noreferrer"
            >
              Preview lesson
            </a>
          </div>
        </form>

        <form
          action={`/api/admin/lessons/${lesson._id}/delete`}
          method="POST"
          style={{ marginTop: 32 }}
        >
          <button
            type="submit"
            style={{
              background: "#b00020",
              color: "#fff",
              border: 0,
              padding: "10px 14px",
              borderRadius: 8,
            }}
          >
            Delete lesson
          </button>
        </form>
      </main>
    </Shell>
  );
}