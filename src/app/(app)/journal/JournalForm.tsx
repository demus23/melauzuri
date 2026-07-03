"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./journal.module.css";

const feelings = [
  { value: "great", label: "Great", emoji: "🙂" },
  { value: "okay", label: "Okay", emoji: "😐" },
  { value: "irritated", label: "Irritated", emoji: "😕" },
  { value: "flare-up", label: "Flare-up", emoji: "😣" },
] as const;

export default function JournalForm() {
  const router = useRouter();
  const [feeling, setFeeling] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhoto(e.target.files?.[0] || null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!feeling) {
      setError("Pick how your skin's feeling today before saving.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("feeling", feeling);
      formData.append("note", note);
      if (photo) formData.append("photo", photo);

      const res = await fetch("/api/journal", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to save entry");

      setFeeling(null);
      setNote("");
      setPhoto(null);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Something went wrong saving your entry. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.formCard} onSubmit={handleSubmit}>
      <div className={styles.formHead}>
        <h2 className={styles.h2}>New entry</h2>
        <p className={styles.muted}>How's your skin feeling today?</p>
      </div>

      <div className={styles.feelingRow}>
        {feelings.map((f) => (
          <button
            key={f.value}
            type="button"
            className={`${styles.feelingOption} ${feeling === f.value ? styles.feelingOptionActive : ""}`}
            onClick={() => setFeeling(f.value)}
            aria-pressed={feeling === f.value}
          >
            <span aria-hidden="true" className={styles.feelingEmoji}>{f.emoji}</span>
            {f.label}
          </button>
        ))}
      </div>

      <div className={styles.field}>
        <label htmlFor="journalNote">Note (optional)</label>
        <textarea
          id="journalNote"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Anything worth remembering — new product, flare-up trigger, what helped."
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="journalPhoto">Photo (optional)</label>
        <label className={styles.photoUploadBtn}>
          {photo ? photo.name : "Add a photo"}
          <input
            id="journalPhoto"
            type="file"
            accept="image/*"
            hidden
            onChange={handlePhotoChange}
          />
        </label>
      </div>

      {error && <p className={styles.errorText}>{error}</p>}

      <button type="submit" className={styles.primary} disabled={loading}>
        {loading ? "Saving..." : "Save entry"}
      </button>
    </form>
  );
}