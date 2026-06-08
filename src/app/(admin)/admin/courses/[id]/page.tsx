import type React from "react";
import Shell from "@/components/Shell";
import { requireAccess } from "@/lib/requireAccess";
import dbConnect from "@/lib/mongoose";
import Course from "@/lib/models/Course";
import Lesson from "@/lib/models/Lesson";
import { notFound } from "next/navigation";
import { Types } from "mongoose";
import Link from "next/link";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminCourseEditorPage({ params }: PageProps) {
  await requireAccess("admin");
  await dbConnect();

  const { id } = await params;

  if (!Types.ObjectId.isValid(id)) notFound();

  const course = await Course.findById(id).lean();
  if (!course) notFound();

  const lessons = await Lesson.find({ courseId: course._id })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  return (
    <Shell>
      <main
        style={{
          minHeight: "100vh",
          padding: "32px 24px",
          background:
            "linear-gradient(135deg, #f7fbf8 0%, #fff8f2 45%, #f4f7ff 100%)",
        }}
      >
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Link
            href="/admin/courses"
            style={{
              display: "inline-flex",
              marginBottom: 20,
              color: "#20382c",
              textDecoration: "none",
              fontWeight: 800,
            }}
          >
            ← Back to courses
          </Link>

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 0.8fr",
              gap: 22,
              marginBottom: 28,
            }}
          >
            <div
              style={{
                padding: 32,
                borderRadius: 30,
                background: "rgba(255,255,255,0.82)",
                border: "1px solid rgba(255,255,255,0.9)",
                boxShadow: "0 24px 70px rgba(20,44,35,0.08)",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  letterSpacing: 1.3,
                  color: "#7a857d",
                  textTransform: "uppercase",
                }}
              >
                Course editor
              </div>

              <h1
                style={{
                  fontSize: "clamp(34px, 5vw, 54px)",
                  lineHeight: 1,
                  margin: "12px 0",
                  color: "#16251d",
                }}
              >
                {course.title}
              </h1>

              <p
                style={{
                  maxWidth: 720,
                  fontSize: 17,
                  lineHeight: 1.7,
                  color: "#526057",
                }}
              >
                Edit course details, publish content, add lessons, and organize
                your academy curriculum.
              </p>
            </div>

            <div
              style={{
                padding: 26,
                borderRadius: 30,
                background: "#20382c",
                color: "#fff",
                boxShadow: "0 24px 70px rgba(20,44,35,0.18)",
              }}
            >
              <div style={{ opacity: 0.8, fontSize: 13 }}>Course status</div>
              <h2 style={{ fontSize: 38, margin: "8px 0" }}>
                {course.isPublished ? "Published" : "Draft"}
              </h2>
              <p style={{ opacity: 0.85 }}>
                {lessons.length} lesson{lessons.length === 1 ? "" : "s"} added
              </p>

              {course.isPublished && (
                <Link
                  href={`/courses/${course.slug}`}
                  target="_blank"
                  style={{
                    display: "inline-flex",
                    marginTop: 16,
                    padding: "12px 16px",
                    borderRadius: 999,
                    background: "#fff",
                    color: "#20382c",
                    textDecoration: "none",
                    fontWeight: 800,
                  }}
                >
                  Preview course
                </Link>
              )}
            </div>
          </section>

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 0.9fr",
              gap: 24,
              alignItems: "start",
            }}
          >
            <div style={{ display: "grid", gap: 24 }}>
              <div
                style={{
                  border: "1px solid rgba(20,44,35,0.08)",
                  borderRadius: 28,
                  padding: 24,
                  background: "#fff",
                  boxShadow: "0 18px 55px rgba(20,44,35,0.06)",
                }}
              >
                <h2 style={{ marginTop: 0, color: "#16251d" }}>
                  Course settings
                </h2>

                <form
                  action={`/api/admin/courses/${course._id}/update`}
                  method="POST"
                  style={{ display: "grid", gap: 14 }}
                >
                  <input
                    name="title"
                    defaultValue={course.title}
                    required
                    style={inputStyle}
                  />

                  <input
                    name="slug"
                    defaultValue={course.slug}
                    required
                    style={inputStyle}
                  />

                  <textarea
                    name="description"
                    defaultValue={course.description || ""}
                    rows={5}
                    style={textareaStyle}
                    placeholder="Course description"
                  />

                  <input
                    name="thumbnailUrl"
                    defaultValue={course.thumbnailUrl || ""}
                    placeholder="Thumbnail URL"
                    style={inputStyle}
                  />

                  <input
                    name="category"
                    defaultValue={course.category || ""}
                    placeholder="Category"
                    style={inputStyle}
                  />

                  <select
                    name="level"
                    defaultValue={course.level || "beginner"}
                    style={inputStyle}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>

                  <input
                    name="order"
                    type="number"
                    defaultValue={course.order || 0}
                    placeholder="Order"
                    style={inputStyle}
                  />

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      color: "#526057",
                      fontWeight: 700,
                    }}
                  >
                    <input
                      type="checkbox"
                      name="isPublished"
                      value="true"
                      defaultChecked={Boolean(course.isPublished)}
                    />
                    Published
                  </label>

                  <button type="submit" style={primaryButton}>
                    Save course
                  </button>
                </form>
              </div>

              <div
                style={{
                  border: "1px solid rgba(20,44,35,0.08)",
                  borderRadius: 28,
                  padding: 24,
                  background: "#fff",
                  boxShadow: "0 18px 55px rgba(20,44,35,0.06)",
                }}
              >
                <h2 style={{ marginTop: 0, color: "#16251d" }}>Lessons</h2>

                <div style={{ display: "grid", gap: 12 }}>
                  {(lessons as any[]).map((lesson) => (
                    <div
                      key={String(lesson._id)}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto",
                        gap: 16,
                        alignItems: "center",
                        padding: 16,
                        borderRadius: 18,
                        background: "#f7faf7",
                        border: "1px solid #eef2ef",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: "inline-flex",
                            padding: "5px 9px",
                            borderRadius: 999,
                            background: lesson.isPublished
                              ? "#e6f5ea"
                              : "#eee",
                            color: lesson.isPublished ? "#20382c" : "#666",
                            fontSize: 12,
                            fontWeight: 800,
                            marginBottom: 8,
                          }}
                        >
                          {lesson.isPublished ? "Published" : "Draft"}
                        </div>

                        <h3 style={{ margin: 0, color: "#16251d" }}>
                          {lesson.title}
                        </h3>

                        <p
                          style={{
                            margin: "6px 0",
                            color: "#657268",
                            fontSize: 14,
                          }}
                        >
                          {lesson.moduleTitle} • Order {lesson.order}
                        </p>
                      </div>

                      <Link
                        href={`/admin/lessons/${lesson._id}`}
                        style={{
                          padding: "10px 14px",
                          borderRadius: 999,
                          background: "#20382c",
                          color: "#fff",
                          textDecoration: "none",
                          fontWeight: 800,
                          whiteSpace: "nowrap",
                        }}
                      >
                        Edit lesson
                      </Link>
                    </div>
                  ))}

                  {lessons.length === 0 && (
                    <p style={{ color: "#657268" }}>No lessons added yet.</p>
                  )}
                </div>
              </div>
            </div>

            <aside
              style={{
                border: "1px solid rgba(20,44,35,0.08)",
                borderRadius: 28,
                padding: 24,
                background: "#fff",
                boxShadow: "0 18px 55px rgba(20,44,35,0.06)",
                position: "sticky",
                top: 24,
              }}
            >
              <h2 style={{ marginTop: 0, color: "#16251d" }}>Add lesson</h2>

              <form
                action={`/api/admin/courses/${course._id}/lessons/create`}
                method="POST"
                style={{ display: "grid", gap: 12 }}
              >
                <input
                  name="moduleTitle"
                  placeholder="Module title"
                  required
                  style={inputStyle}
                />

                <input
                  name="title"
                  placeholder="Lesson title"
                  required
                  style={inputStyle}
                />

                <input
                  name="slug"
                  placeholder="lesson-slug"
                  required
                  style={inputStyle}
                />

                <textarea
                  name="description"
                  placeholder="Lesson description"
                  rows={3}
                  style={textareaStyle}
                />

                <input
                  name="videoUrl"
                  placeholder="YouTube/Vimeo video URL"
                  style={inputStyle}
                />

                <textarea
                  name="content"
                  placeholder="Lesson notes/content"
                  rows={6}
                  style={textareaStyle}
                />

                <input
                  name="durationMinutes"
                  type="number"
                  placeholder="Duration minutes"
                  style={inputStyle}
                />

                <input
                  name="order"
                  type="number"
                  placeholder="Order"
                  style={inputStyle}
                />

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    color: "#526057",
                    fontWeight: 700,
                  }}
                >
                  <input type="checkbox" name="isPreview" value="true" />
                  Preview lesson
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    color: "#526057",
                    fontWeight: 700,
                  }}
                >
                  <input type="checkbox" name="isPublished" value="true" />
                  Publish lesson
                </label>

                <button type="submit" style={primaryButton}>
                  Add lesson
                </button>
              </form>
            </aside>
          </section>
        </div>
      </main>
    </Shell>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 14px",
  borderRadius: 14,
  border: "1px solid #dfe7e1",
  outline: "none",
  fontSize: 15,
  background: "#fff",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: "vertical",
  fontFamily: "inherit",
};

const primaryButton: React.CSSProperties = {
  padding: "13px 18px",
  borderRadius: 999,
  border: 0,
  background: "#20382c",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
};