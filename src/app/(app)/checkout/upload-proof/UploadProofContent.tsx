"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./upload-proof.module.css";

function isAllowedFile(file: File) {
  const okTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
  const maxMB = 10;
  const sizeOk = file.size <= maxMB * 1024 * 1024;
  const typeOk = okTypes.includes(file.type);
  return { ok: sizeOk && typeOk, sizeOk, typeOk, maxMB };
}

export default function UploadProofPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const orderId = sp.get("orderId");

  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  const isPdf = file?.type === "application/pdf";

  const pickFile = (f: File | null) => {
    setErr(null);
    if (!f) return setFile(null);

    const check = isAllowedFile(f);
    if (!check.ok) {
      if (!check.typeOk) {
        setErr("File type not supported. Use JPG, PNG, WEBP, or PDF.");
      } else if (!check.sizeOk) {
        setErr(`File too large. Max ${check.maxMB}MB.`);
      } else {
        setErr("Invalid file.");
      }
      setFile(null);
      return;
    }
    setFile(f);
  };

  const submit = async () => {
    if (!orderId) return setErr("Missing orderId. Please go back and try again.");
    if (!file) return setErr("Please upload a screenshot or PDF receipt.");

    setErr(null);
    setLoading(true);

    try {
      const form = new FormData();
      form.append("orderId", orderId);
      form.append("proof", file);

      const res = await fetch("/api/payments/submit-proof", {
        method: "POST",
        body: form,
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(json.error || "Upload failed. Please try again.");
        return;
      }

      router.push("/payments/status");
    } catch {
      setErr("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.top}>
        <div className={styles.crumbs}>
          <Link href="/checkout/manual" className={styles.crumbLink}>Manual payment</Link>
          <span className={styles.crumbDot}>•</span>
          <span className={styles.crumbHere}>Upload proof</span>
        </div>

        <h1 className={styles.h1}>Upload payment proof</h1>
        <p className={styles.sub}>
          Upload a screenshot or PDF receipt. We’ll review it and approve your order.
        </p>
      </div>

      <div className={styles.grid}>
        {/* Upload card */}
        <section className={styles.card}>
          <div
            className={`${styles.drop} ${dragOver ? styles.dropActive : ""}`}
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragOver(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragOver(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragOver(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragOver(false);
              const f = e.dataTransfer.files?.[0] ?? null;
              pickFile(f);
            }}
          >
            <div className={styles.dropIcon} />
            <div className={styles.dropTitle}>Drag & drop your proof</div>
            <div className={styles.dropSub}>
              JPG / PNG / WEBP / PDF • max 10MB
            </div>

            <label className={styles.fileBtn}>
              Choose file
              <input
                className={styles.fileInput}
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                onChange={(e) => pickFile(e.target.files?.[0] || null)}
              />
            </label>

            {file && (
              <div className={styles.fileMeta}>
                <div className={styles.fileName}>{file.name}</div>
                <button
                  type="button"
                  className={styles.clear}
                  onClick={() => pickFile(null)}
                  disabled={loading}
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {err && <div className={styles.error}>{err}</div>}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primary}
              onClick={submit}
              disabled={loading || !file || !orderId}
              aria-busy={loading}
            >
              {loading ? "Uploading…" : "Submit for approval"}
            </button>

            <Link className={styles.secondary} href={orderId ? `/checkout/manual?orderId=${orderId}` : "/checkout/manual"}>
              Back
            </Link>
          </div>

          <div className={styles.hint}>
            After you submit, your status becomes <b>Waiting approval</b>.
          </div>
        </section>

        {/* Preview card */}
        <aside className={styles.previewCard}>
          <div className={styles.previewHead}>
            <div className={styles.kicker}>Preview</div>
            <div className={styles.previewTitle}>Make sure it’s readable</div>
          </div>

          <div className={styles.previewBody}>
            {!file && (
              <div className={styles.empty}>
                Upload a file to see a preview here.
              </div>
            )}

            {file && previewUrl && !isPdf && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className={styles.previewImg} src={previewUrl} alt="Payment proof preview" />
            )}

            {file && previewUrl && isPdf && (
              <div className={styles.pdfBox}>
                <div className={styles.pdfIcon} />
                <div>
                  <div className={styles.pdfTitle}>PDF uploaded</div>
                  <div className={styles.pdfSub}>
                    We’ll review the PDF during approval.
                  </div>
                </div>
                <a className={styles.pdfOpen} href={previewUrl} target="_blank" rel="noreferrer">
                  Open
                </a>
              </div>
            )}
          </div>

          <div className={styles.previewFooter}>
            <div className={styles.mini}>
              Include: amount, date, and the <b>reference</b> if possible.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
