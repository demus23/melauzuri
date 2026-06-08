import Shell from "@/components/Shell";
import { requireAccess } from "@/lib/requireAccess";
import dbConnect from "@/lib/mongoose";
import Course from "@/lib/models/Course";
import Lesson from "@/lib/models/Lesson";
import Link from "next/link";

export default async function AdminCoursesPage() {
  await requireAccess("admin");
  await dbConnect();

  const courses = await Course.find({})
    .sort({ order: 1, createdAt: -1 })
    .lean();

  const courseIds = courses.map((course: any) => course._id);

  const lessons = await Lesson.find({
    courseId: { $in: courseIds },
  }).lean();

  const publishedCount = (courses as any[]).filter((c) => c.isPublished).length;
  const draftCount = courses.length - publishedCount;

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
                Admin academy
              </div>

              <h1
                style={{
                  fontSize: "clamp(34px, 5vw, 56px)",
                  lineHeight: 1,
                  margin: "12px 0",
                  color: "#16251d",
                }}
              >
                Course Manager
              </h1>

              <p
                style={{
                  maxWidth: 720,
                  fontSize: 17,
                  lineHeight: 1.7,
                  color: "#526057",
                }}
              >
                Create training programs, organize lessons, publish videos, and
                manage your skincare academy content.
              </p>

              <Link
                href="/admin/courses/new"
                style={{
                  display: "inline-flex",
                  marginTop: 18,
                  padding: "13px 18px",
                  borderRadius: 999,
                  background: "#20382c",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 800,
                }}
              >
                + Create course
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <div
                style={{
                  padding: 22,
                  borderRadius: 24,
                  background: "#20382c",
                  color: "#fff",
                }}
              >
                <div style={{ opacity: 0.8, fontSize: 13 }}>Total courses</div>
                <strong style={{ fontSize: 42 }}>{courses.length}</strong>
              </div>

              <div
                style={{
                  padding: 22,
                  borderRadius: 24,
                  background: "#fff",
                  border: "1px solid rgba(20,44,35,0.08)",
                }}
              >
                <div style={{ color: "#7a857d", fontSize: 13 }}>
                  Total lessons
                </div>
                <strong style={{ fontSize: 42, color: "#16251d" }}>
                  {lessons.length}
                </strong>
              </div>

              <div
                style={{
                  padding: 22,
                  borderRadius: 24,
                  background: "#fff",
                  border: "1px solid rgba(20,44,35,0.08)",
                }}
              >
                <div style={{ color: "#7a857d", fontSize: 13 }}>Published</div>
                <strong style={{ fontSize: 42, color: "#16251d" }}>
                  {publishedCount}
                </strong>
              </div>

              <div
                style={{
                  padding: 22,
                  borderRadius: 24,
                  background: "#fff",
                  border: "1px solid rgba(20,44,35,0.08)",
                }}
              >
                <div style={{ color: "#7a857d", fontSize: 13 }}>Drafts</div>
                <strong style={{ fontSize: 42, color: "#16251d" }}>
                  {draftCount}
                </strong>
              </div>
            </div>
          </section>

          <section style={{ display: "grid", gap: 18 }}>
            {(courses as any[]).map((course) => {
              const lessonCount = lessons.filter(
                (lesson: any) => String(lesson.courseId) === String(course._id)
              ).length;

              return (
                <article
                  key={String(course._id)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "150px 1fr auto",
                    gap: 20,
                    alignItems: "center",
                    padding: 18,
                    borderRadius: 26,
                    background: "#fff",
                    border: "1px solid rgba(20,44,35,0.08)",
                    boxShadow: "0 18px 55px rgba(20,44,35,0.06)",
                  }}
                >
                  <div
                    style={{
                      height: 105,
                      borderRadius: 20,
                      background: course.thumbnailUrl
                        ? `url(${course.thumbnailUrl}) center/cover`
                        : "linear-gradient(135deg, #20382c, #8fb69c)",
                    }}
                  />

                  <div>
                    <div
                      style={{
                        display: "inline-flex",
                        padding: "6px 10px",
                        borderRadius: 999,
                        background: course.isPublished ? "#e6f5ea" : "#f2f2f2",
                        color: course.isPublished ? "#20382c" : "#666",
                        fontSize: 12,
                        fontWeight: 800,
                        marginBottom: 8,
                      }}
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </div>

                    <h2 style={{ margin: 0, color: "#16251d" }}>
                      {course.title}
                    </h2>

                    <p style={{ margin: "8px 0", color: "#657268" }}>
                      {course.description || "No description added."}
                    </p>

                    <div style={{ fontSize: 13, color: "#7a857d" }}>
                      {course.category || "Skincare"} • {course.level} •{" "}
                      {lessonCount} lessons
                    </div>
                  </div>

                  <Link
                    href={`/admin/courses/${course._id}`}
                    style={{
                      padding: "12px 16px",
                      borderRadius: 999,
                      background: "#20382c",
                      color: "#fff",
                      textDecoration: "none",
                      fontWeight: 800,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Edit course
                  </Link>
                </article>
              );
            })}

            {courses.length === 0 && (
              <div
                style={{
                  padding: 32,
                  borderRadius: 24,
                  background: "#fff",
                  border: "1px solid #e8e8e8",
                }}
              >
                <h2>No courses yet</h2>
                <p>Create your first course to start building the academy.</p>
                <Link href="/admin/courses/new">Create course</Link>
              </div>
            )}
          </section>
        </div>
      </main>
    </Shell>
  );
}