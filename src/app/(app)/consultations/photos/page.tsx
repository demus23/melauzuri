/*src\app\(app)\consultations\photos\page.tsx*/
"use client";

import Shell from "@/components/Shell";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./photos.module.css";

const photoTips = [
  "Take photos in bright natural light or strong indoor light.",
  "Upload front, left, and right side angles.",
  "Do not use beauty filters or heavy editing.",
  "Keep your face clean if possible.",
  "Make sure the skin concern is clearly visible.",
];

export default function ConsultationPhotosPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
  }

  async function handleUpload() {
    if (files.length === 0) {
      alert("Please choose at least one photo.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("photos", file);
      });

      const res = await fetch("/api/consultations/photos", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      router.push("/consultations/status");
    } catch (error) {
      console.error(error);
      alert("Failed to upload photos. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Shell>
      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.badge}>Step 2 of 3</div>
          <h1 className={styles.h1}>Upload Skin Photos</h1>
          <p className={styles.p}>
            Clear photos help us better understand your skin condition and give
            more accurate guidance.
          </p>
        </section>

        <div className={styles.grid}>
          <section className={styles.card}>
            <h2 className={styles.h2}>Photo upload</h2>
            <p className={styles.muted}>
              Add clear images of your skin from multiple angles.
            </p>

            <div className={styles.uploadBox}>
              <div>
                <div className={styles.uploadIcon} aria-hidden="true" />
                <p className={styles.uploadTitle}>Drag and drop photos here</p>
                <p className={styles.uploadText}>
                  or click below to choose files
                </p>

                <label className={styles.uploadBtn}>
                  Choose photos
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>

            {files.length > 0 && (
              <div className={styles.fileList}>
                <h3 className={styles.fileListTitle}>Selected files</h3>
                <ul className={styles.listPlain}>
                  {files.map((file) => (
                    <li key={`${file.name}-${file.size}`}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.primary}
                onClick={handleUpload}
                disabled={loading}
              >
                {loading ? "Uploading..." : "Save photos"}
              </button>

              <Link href="/consultations/start" className={styles.secondary}>
  Back to questionnaire
</Link>
            </div>
          </section>

          <aside className={styles.sideCard}>
            <h2 className={styles.h2}>Photo tips</h2>
            <ul className={styles.list}>
              {photoTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </Shell>
  );
}