"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Shell from "@/components/Shell";
import styles from "@/components/auth.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setErr(data.error || "Registration failed");
      return;
    }

    router.push("/login");
  };

  return (
    <Shell>
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <h1 className={styles.title}>Create account</h1>
          <p className={styles.subtitle}>
            Start your melanin-safe skincare journey
          </p>

          <form onSubmit={submit} className={styles.form}>
            <input
              className={styles.input}
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className={styles.input}
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className={styles.primary} disabled={loading}>
              {loading ? "Creating…" : "Create account"}
            </button>
          </form>

          {err && <p style={{ color: "#fca5a5" }}>{err}</p>}

          <div className={styles.footer}>
            Already have an account?{" "}
            <a href="/login" className={styles.link}>
              Sign in
            </a>
          </div>
        </div>
      </div>
    </Shell>
  );
}
