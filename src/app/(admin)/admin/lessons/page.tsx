import Link from "next/link";
import Shell from "@/components/Shell";
import { requireAccess } from "@/lib/requireAccess";

export default async function AdminLessonsPage() {
  await requireAccess("admin");

  return (
    <Shell>
      <main style={{ padding: 32, maxWidth: 1100, margin: "0 auto" }}>
        <h1>Lessons</h1>
        <p>Manage lessons from inside each course.</p>

        <Link href="/admin/courses">
          Go to Courses
        </Link>
      </main>
    </Shell>
  );
}