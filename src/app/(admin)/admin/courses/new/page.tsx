import Shell from "@/components/Shell";
import { requireAccess } from "@/lib/requireAccess";

export default async function NewCoursePage() {
  await requireAccess("admin");

  return (
    <Shell>
      <main style={{ padding: 24 }}>
        <h1>Create Course</h1>

        <form
          action="/api/admin/courses/create"
          method="POST"
          style={{ display: "grid", gap: 14, maxWidth: 700 }}
        >
          <input name="title" placeholder="Course title" required />
          <input name="slug" placeholder="course-slug" required />
          <textarea name="description" placeholder="Course description" rows={5} />
          <input name="thumbnailUrl" placeholder="Thumbnail URL" />
          <input name="category" placeholder="Category e.g. Skincare" />

          <select name="level" defaultValue="beginner">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <label>
            <input type="checkbox" name="isPublished" value="true" /> Publish now
          </label>

          <button type="submit">Create course</button>
        </form>
      </main>
    </Shell>
  );
}