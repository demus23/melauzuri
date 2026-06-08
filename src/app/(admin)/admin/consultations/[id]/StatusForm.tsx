"use client";

import { useState, useTransition } from "react";
import styles from "./consultation-detail.module.css";

const STATUS_OPTIONS = [
  "new",
  "reviewing",
  "booked",
  "completed",
  "cancelled",
] as const;

type StatusValue = (typeof STATUS_OPTIONS)[number];

export default function StatusForm({
  consultationId,
  currentStatus,
}: {
  consultationId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState<StatusValue>(
    STATUS_OPTIONS.includes(currentStatus as StatusValue)
      ? (currentStatus as StatusValue)
      : "new"
  );
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/consultations/${consultationId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Failed to update status");
        }

        setMessage("Status updated successfully.");
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Something went wrong."
        );
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <label className={styles.field}>
        <span className={styles.label}>Consultation status</span>
        <select
          className={styles.select}
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusValue)}
          disabled={isPending}
        >
          {STATUS_OPTIONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <button type="submit" className={styles.primary} disabled={isPending}>
        {isPending ? "Saving..." : "Save status"}
      </button>

      {message ? <p className={styles.formMessage}>{message}</p> : null}
    </form>
  );
}