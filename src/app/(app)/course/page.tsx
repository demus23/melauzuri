// src/app/(app)/course/page.tsx
import Shell from "@/components/Shell";
import { requireAccess } from "@/lib/requireAccess";

export default async function CoursePage() {
  await requireAccess("course");

  return (
    <Shell>
      <main style={{ padding: 24 }}>
        <h1>Course</h1>
        <p>✅ Access active. Welcome to your course.</p>
      </main>
    </Shell>
  );
}
