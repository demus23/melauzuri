import Shell from "@/components/Shell";
import { requireAccess } from "@/lib/requireAccess";
import dbConnect from "@/lib/mongoose";
import Course from "@/lib/models/Course";
import Lesson from "@/lib/models/Lesson";
import UserLessonProgress from "@/lib/models/UserLessonProgress";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CourseDetailPage({ params }: PageProps) {
  const user = await requireAccess("course");
  await dbConnect();

  const { slug } = await params;

  const course = await Course.findOne({
    slug,
    isPublished: true,
  }).lean();

  if (!course) notFound();

  const lessons = await Lesson.find({
    courseId: course._id,
    isPublished: true,
  })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  const progress = await UserLessonProgress.find({
    userId: user._id,
    courseId: course._id,
  }).lean();

  const completedLessonIds = new Set(
    progress
      .filter((item: any) => item.completed)
      .map((item: any) => String(item.lessonId))
  );

  const totalLessons = lessons.length;
  const completedLessons = completedLessonIds.size;

  const percent =
    totalLessons === 0
      ? 0
      : Math.round((completedLessons / totalLessons) * 100);

  const groupedLessons = lessons.reduce((acc: any, lesson: any) => {
    const moduleTitle = lesson.moduleTitle || "Module";
    if (!acc[moduleTitle]) acc[moduleTitle] = [];
    acc[moduleTitle].push(lesson);
    return acc;
  }, {});

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
            href="/courses"
            style={{
              display: "inline-flex",
              marginBottom: 20,
              color: "#20382c",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            ← Back to courses
          </Link>

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1.3fr 0.7fr",
              gap: 24,
              marginBottom: 28,
            }}
          >
            <div
              style={{
                padding: 34,
                borderRadius: 30,
                background: "rgba(255,255,255,0.8)",
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
                {course.category || "Course"} • {course.level}
              </div>

              <h1
                style={{
                  fontSize: "clamp(34px, 5vw, 56px)",
                  lineHeight: 1,
                  margin: "12px 0",
                  color: "#16251d",
                }}
              >
                {course.title}
              </h1>

              <p
                style={{
                  maxWidth: 760,
                  fontSize: 17,
                  lineHeight: 1.7,
                  color: "#526057",
                }}
              >
                {course.description || "Continue your learning journey."}
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
              <div style={{ opacity: 0.8, fontSize: 13 }}>Your progress</div>

              <div style={{ fontSize: 54, fontWeight: 800, margin: "8px 0" }}>
                {percent}%
              </div>

              <p style={{ opacity: 0.85 }}>
                {completedLessons} of {totalLessons} lessons completed
              </p>

              <div
                style={{
                  height: 10,
                  background: "rgba(255,255,255,0.18)",
                  borderRadius: 999,
                  overflow: "hidden",
                  marginTop: 18,
                }}
              >
                <div
                  style={{
                    width: `${percent}%`,
                    height: "100%",
                    background: "#bfe8c8",
                  }}
                />
              </div>
            </div>
          </section>

          <section style={{ display: "grid", gap: 22 }}>
            {Object.entries(groupedLessons).map(([moduleTitle, moduleLessons], moduleIndex) => (
              <div
                key={moduleTitle}
                style={{
                  border: "1px solid rgba(20,44,35,0.08)",
                  borderRadius: 28,
                  background: "#fff",
                  overflow: "hidden",
                  boxShadow: "0 18px 55px rgba(20,44,35,0.06)",
                }}
              >
                <div
                  style={{
                    padding: 22,
                    background: "#f7faf7",
                    borderBottom: "1px solid #eef2ef",
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      color: "#7a857d",
                      marginBottom: 6,
                    }}
                  >
                    Module {moduleIndex + 1}
                  </div>
                  <h2 style={{ margin: 0, color: "#16251d" }}>
                    {moduleTitle}
                  </h2>
                </div>

                <div>
                  {(moduleLessons as any[]).map((lesson, index) => {
                    const completed = completedLessonIds.has(String(lesson._id));

                    return (
                      <Link
                        key={String(lesson._id)}
                        href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "44px 1fr auto",
                          alignItems: "center",
                          gap: 16,
                          padding: 20,
                          borderBottom: "1px solid #eef2ef",
                          textDecoration: "none",
                          color: "inherit",
                        }}
                      >
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: "50%",
                            display: "grid",
                            placeItems: "center",
                            background: completed ? "#20382c" : "#eef2ef",
                            color: completed ? "#fff" : "#20382c",
                            fontWeight: 800,
                          }}
                        >
                          {completed ? "✓" : index + 1}
                        </div>

                        <div>
                          <strong style={{ color: "#16251d" }}>
                            {lesson.title}
                          </strong>
                          <p
                            style={{
                              margin: "6px 0 0",
                              color: "#657268",
                              lineHeight: 1.5,
                            }}
                          >
                            {lesson.description || "Open this lesson"}
                          </p>
                        </div>

                        <span
                          style={{
                            padding: "8px 12px",
                            borderRadius: 999,
                            background: completed ? "#e6f5ea" : "#f3f3f3",
                            color: completed ? "#20382c" : "#666",
                            fontSize: 13,
                            fontWeight: 700,
                          }}
                        >
                          {completed ? "Completed" : "Start"}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            {lessons.length === 0 && (
              <div
                style={{
                  padding: 32,
                  borderRadius: 24,
                  background: "#fff",
                  border: "1px solid #e8e8e8",
                }}
              >
                <h2>No lessons available yet</h2>
                <p>Lessons will appear here once published by admin.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </Shell>
  );
}