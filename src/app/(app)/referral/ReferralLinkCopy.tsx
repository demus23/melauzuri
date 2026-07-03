"use client";

import { useState } from "react";
import styles from "./referral.module.css";

export default function ReferralLinkCopy({
  url,
  code,
}: {
  url: string;
  code: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for browsers that block clipboard API
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <div className={styles.copyRow}>
      <div className={styles.urlDisplay}>
        <span className={styles.urlCode}>{code}</span>
        <span className={styles.urlFull}>{url}</span>
      </div>
      <button
        type="button"
        className={`${styles.copyBtn} ${copied ? styles.copyBtnCopied : ""}`}
        onClick={handleCopy}
      >
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}