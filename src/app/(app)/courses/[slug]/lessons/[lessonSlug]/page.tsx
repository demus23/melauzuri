import Shell from "@/components/Shell";
import { requireAccess } from "@/lib/requireAccess";
import dbConnect from "@/lib/mongoose";
import Course from "@/lib/models/Course";
import Lesson from "@/lib/models/Lesson";
import UserLessonProgress from "@/lib/models/UserLessonProgress";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    slug: string;
    lessonSlug: string;
  }>;
};

function getEmbedUrl(videoUrl?: string) {
  if (!videoUrl) return "";

  if (videoUrl.includes("youtube.com/watch?v=")) {
    const id = videoUrl.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  if (videoUrl.includes("youtu.be/")) {
    const id = videoUrl.split("youtu.be/")[1]?.split("?")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  return videoUrl;
}

export default async function LessonPage({ params }: PageProps) {
  const user = await requireAccess("course");
  await dbConnect();

  const { slug, lessonSlug } = await params;

  const course = await Course.findOne({
    slug,
    isPublished: true,
  }).lean();

  if (!course) notFound();

  const lesson = await Lesson.findOne({
    courseId: course._id,
    slug: lessonSlug,
    isPublished: true,
  }).lean();

  if (!lesson) notFound();

  const progress = await UserLessonProgress.findOneAndUpdate(
    {
      userId: user._id,
      courseId: course._id,
      lessonId: lesson._id,
    },
    {
      $set: { lastViewedAt: new Date() },
      $setOnInsert: { completed: false },
    },
    {
      upsert: true,
      new: true,
    }
  ).lean();

  const allLessons = await Lesson.find({
    courseId: course._id,
    isPublished: true,
  })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  const currentIndex = allLessons.findIndex(
    (item: any) => String(item._id) === String(lesson._id)
  );

  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : null;

  const embedUrl = getEmbedUrl(lesson.videoUrl);
  const completed = Boolean((progress as any)?.completed);

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
            href={`/courses/${course.slug}`}
            style={{
              display: "inline-flex",
              marginBottom: 20,
              color: "#20382c",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            ← Back to course
          </Link>

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 320px",
              gap: 24,
              alignItems: "start",
            }}
          >
            <div style={{ display: "grid", gap: 22 }}>
              <div
                style={{
                  padding: 30,
                  borderRadius: 30,
                  background: "rgba(255,255,255,0.82)",
                  border: "1px solid rgba(255,255,255,0.9)",
                  boxShadow: "0 24px 70px rgba(20,44,35,0.08)",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                    color: "#7a857d",
                    marginBottom: 10,
                  }}
                >
                  {lesson.moduleTitle || "Lesson"} •{" "}
                  {lesson.durationMinutes || 0} min
                </div>

                <h1
                  style={{
                    fontSize: "clamp(32px, 5vw, 52px)",
                    lineHeight: 1,
                    margin: 0,
                    color: "#16251d",
                  }}
                >
                  {lesson.title}
                </h1>

                <p
                  style={{
                    marginTop: 14,
                    color: "#526057",
                    fontSize: 17,
                    lineHeight: 1.7,
                  }}
                >
                  {lesson.description || course.title}
                </p>
              </div>

              {embedUrl ? (
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16 / 9",
                    borderRadius: 28,
                    overflow: "hidden",
                    background: "#000",
                    boxShadow: "0 28px 70px rgba(20,44,35,0.16)",
                  }}
                >
                  <iframe
                    src={embedUrl}
                    title={lesson.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: 0,
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div
                  style={{
                    padding: 30,
                    border: "1px solid #e8e8e8",
                    borderRadius: 28,
                    background: "#fff",
                    color: "#526057",
                  }}
                >
                  No video added for this lesson yet.
                </div>
              )}

              {lesson.content && (
                <section
                  style={{
                    padding: 28,
                    border: "1px solid rgba(20,44,35,0.08)",
                    borderRadius: 28,
                    background: "#fff",
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.8,
                    color: "#2c3a32",
                    boxShadow: "0 18px 55px rgba(20,44,35,0.06)",
                  }}
                >
                  <h2 style={{ marginTop: 0, color: "#16251d" }}>
                    Lesson Notes
                  </h2>
                  {lesson.content}
                </section>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                {prevLesson ? (
                  <Link
                    href={`/courses/${course.slug}/lessons/${(prevLesson as any).slug}`}
                    style={{
                      padding: "12px 16px",
                      borderRadius: 999,
                      background: "#fff",
                      border: "1px solid #dfe7e1",
                      color: "#20382c",
                      textDecoration: "none",
                      fontWeight: 700,
                    }}
                  >
                    ← Previous lesson
                  </Link>
                ) : (
                  <span />
                )}

                {nextLesson && (
                  <Link
                    href={`/courses/${course.slug}/lessons/${(nextLesson as any).slug}`}
                    style={{
                      padding: "12px 16px",
                      borderRadius: 999,
                      background: "#20382c",
                      color: "#fff",
                      textDecoration: "none",
                      fontWeight: 700,
                    }}
                  >
                    Next lesson →
                  </Link>
                )}
              </div>
            </div>

            <aside
              style={{
                position: "sticky",
                top: 24,
                display: "grid",
                gap: 16,
              }}
            >
              <div
                style={{
                  padding: 24,
                  borderRadius: 28,
                  background: "#20382c",
                  color: "#fff",
                  boxShadow: "0 24px 70px rgba(20,44,35,0.18)",
                }}
              >
                <div style={{ opacity: 0.8, fontSize: 13 }}>Lesson status</div>

                <h2 style={{ margin: "8px 0" }}>
                  {completed ? "Completed" : "In progress"}
                </h2>

                <p style={{ opacity: 0.85 }}>
                  {completed
                    ? "You have marked this lesson as completed."
                    : "Mark this lesson as completed when you finish watching."}
                </p>

                <form action="/api/courses/progress" method="POST">
                  <input type="hidden" name="courseId" value={String(course._id)} />
                  <input type="hidden" name="lessonId" value={String(lesson._id)} />
                  <input type="hidden" name="courseSlug" value={course.slug} />

                  <button
                    type="submit"
                    style={{
                      width: "100%",
                      marginTop: 14,
                      padding: "13px 16px",
                      borderRadius: 999,
                      border: 0,
                      background: completed ? "#bfe8c8" : "#fff",
                      color: "#20382c",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    {completed ? "Completed ✓" : "Mark complete"}
                  </button>
                </form>
              </div>

              <div
                style={{
                  padding: 22,
                  borderRadius: 24,
                  background: "#fff",
                  border: "1px solid rgba(20,44,35,0.08)",
                }}
              >
                <div style={{ fontSize: 13, color: "#7a857d" }}>Course</div>
                <h3 style={{ marginTop: 6 }}>{course.title}</h3>
                <Link
                  href={`/courses/${course.slug}`}
                  style={{
                    color: "#20382c",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  View all lessons
                </Link>
              </div>
            </aside>
          </section>
        </div>
      </main>
    </Shell>
  );
}