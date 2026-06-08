import Shell from "@/components/Shell";
import { requireAccess } from "@/lib/requireAccess";
import dbConnect from "@/lib/mongoose";
import Course from "@/lib/models/Course";
import Lesson from "@/lib/models/Lesson";
import UserLessonProgress from "@/lib/models/UserLessonProgress";
import Link from "next/link";

export default async function CoursesPage() {
  const user = await requireAccess("course");
  await dbConnect();

  const courses = await Course.find({ isPublished: true })
    .sort({ order: 1, createdAt: -1 })
    .lean();

  const courseIds = courses.map((course: any) => course._id);

  const lessons = await Lesson.find({
    courseId: { $in: courseIds },
    isPublished: true,
  }).lean();

  const progress = await UserLessonProgress.find({
    userId: user._id,
    courseId: { $in: courseIds },
  }).lean();

  function getProgress(courseId: string) {
    const courseLessons = lessons.filter(
      (lesson: any) => String(lesson.courseId) === courseId
    );

    const completed = progress.filter(
      (item: any) => String(item.courseId) === courseId && item.completed
    );

    return {
      total: courseLessons.length,
      completed: completed.length,
      percent:
        courseLessons.length === 0
          ? 0
          : Math.round((completed.length / courseLessons.length) * 100),
    };
  }

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
        <section
          style={{
            maxWidth: 1180,
            margin: "0 auto 32px",
            padding: 32,
            borderRadius: 28,
            background: "rgba(255,255,255,0.75)",
            border: "1px solid rgba(255,255,255,0.8)",
            boxShadow: "0 24px 70px rgba(20, 44, 35, 0.08)",
          }}
        >
          <div style={{ fontSize: 13, letterSpacing: 1.4, opacity: 0.65 }}>
            MELA UZURI ACADEMY
          </div>

          <h1
            style={{
              fontSize: "clamp(34px, 5vw, 58px)",
              lineHeight: 1,
              margin: "12px 0",
              color: "#16251d",
            }}
          >
            Your Learning Dashboard
          </h1>

          <p
            style={{
              maxWidth: 720,
              fontSize: 17,
              lineHeight: 1.7,
              color: "#526057",
            }}
          >
            Continue your skincare education, track progress, and build expert
            confidence step by step.
          </p>
        </section>

        <section
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 22,
          }}
        >
          {courses.length === 0 ? (
            <div
              style={{
                gridColumn: "1 / -1",
                padding: 32,
                borderRadius: 24,
                background: "#fff",
                border: "1px solid #e8e8e8",
              }}
            >
              <h2>No courses available yet</h2>
              <p>Published courses will appear here once admin adds them.</p>
            </div>
          ) : (
            (courses as any[]).map((course) => {
              const stats = getProgress(String(course._id));

              return (
                <article
                  key={String(course._id)}
                  style={{
                    overflow: "hidden",
                    borderRadius: 28,
                    background: "#fff",
                    border: "1px solid rgba(20,44,35,0.08)",
                    boxShadow: "0 18px 55px rgba(20, 44, 35, 0.08)",
                  }}
                >
                  <div
                    style={{
                      height: 190,
                      background: course.thumbnailUrl
                        ? `url(${course.thumbnailUrl}) center/cover`
                        : "linear-gradient(135deg, #20382c, #8fb69c)",
                      display: "flex",
                      alignItems: "flex-end",
                      padding: 18,
                      color: "#fff",
                    }}
                  >
                    <span
                      style={{
                        padding: "7px 12px",
                        borderRadius: 999,
                        background: "rgba(0,0,0,0.35)",
                        fontSize: 13,
                      }}
                    >
                      {course.level || "Beginner"}
                    </span>
                  </div>

                  <div style={{ padding: 22 }}>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#7a857d",
                        marginBottom: 8,
                      }}
                    >
                      {course.category || "Skincare"} • {stats.total} lessons
                    </div>

                    <h2
                      style={{
                        margin: 0,
                        fontSize: 24,
                        color: "#16251d",
                      }}
                    >
                      {course.title}
                    </h2>

                    <p
                      style={{
                        color: "#5f6b63",
                        lineHeight: 1.6,
                        minHeight: 52,
                      }}
                    >
                      {course.description || "Start learning this course."}
                    </p>

                    <div style={{ marginTop: 18 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 13,
                          color: "#526057",
                          marginBottom: 8,
                        }}
                      >
                        <span>
                          {stats.completed}/{stats.total} completed
                        </span>
                        <strong>{stats.percent}%</strong>
                      </div>

                      <div
                        style={{
                          height: 10,
                          background: "#eef2ef",
                          borderRadius: 999,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${stats.percent}%`,
                            height: "100%",
                            background:
                              "linear-gradient(90deg, #20382c, #79b28d)",
                          }}
                        />
                      </div>
                    </div>

                    <Link
                      href={`/courses/${course.slug}`}
                      style={{
                        display: "inline-flex",
                        marginTop: 22,
                        padding: "12px 18px",
                        borderRadius: 999,
                        background: "#20382c",
                        color: "#fff",
                        textDecoration: "none",
                        fontWeight: 700,
                      }}
                    >
                      Continue course
                    </Link>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </main>
    </Shell>
  );
}