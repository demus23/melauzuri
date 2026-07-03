/*src\app\(app)\consultations\photos\page.tsx*/
"use client";

import Shell from "@/components/Shell";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./photos.module.css";

const photoTips = [
  "Take photos in bright natural light or strong indoor light.",
  "Do not use beauty filters or heavy editing.",
  "Keep your face clean if possible.",
  "Make sure the skin concern is clearly visible.",
];

const photoSlots = [
  { id: "frontFace", label: "Front Face" },
  { id: "leftSide", label: "Left Side" },
  { id: "rightSide", label: "Right Side" },
  { id: "affectedAreas", label: "Affected Areas" },
] as const;

type SlotId = typeof photoSlots[number]["id"];

export default function ConsultationPhotosPage() {
  const router = useRouter();
  const [files, setFiles] = useState<Record<SlotId, File | null>>({
    frontFace: null,
    leftSide: null,
    rightSide: null,
    affectedAreas: null,
  });
  const [loading, setLoading] = useState(false);

  function handleSlotChange(slot: SlotId, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setFiles((prev) => ({ ...prev, [slot]: file }));
  }

  const selectedCount = Object.values(files).filter(Boolean).length;

  async function handleUpload() {
    if (selectedCount === 0) {
      alert("Please choose at least one photo.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      photoSlots.forEach(({ id }) => {
        if (files[id]) {
          formData.append(id, files[id] as File);
        }
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
              Add a clear photo for each angle below.
            </p>

            <div className={styles.slotGrid}>
              {photoSlots.map((slot) => (
                <label key={slot.id} className={styles.slotBox}>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => handleSlotChange(slot.id, e)}
                  />
                  <div className={styles.slotIcon} aria-hidden="true" />
                  <div className={styles.slotLabel}>{slot.label}</div>
                  <div className={styles.slotStatus}>
                    {files[slot.id] ? files[slot.id]!.name : "Tap to choose photo"}
                  </div>
                </label>
              ))}
            </div>

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