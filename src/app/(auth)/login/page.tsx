//src\app\(auth)\login\page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Shell from "@/components/Shell";
import styles from "@/components/auth.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setErr("Invalid email or password");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <Shell>
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>
            Sign in to continue your skincare plan
          </p>

          <form onSubmit={submit} className={styles.form}>
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
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {err && <p style={{ color: "#fca5a5" }}>{err}</p>}

          <div className={styles.footer}>
            New here?{" "}
            <a href="/register" className={styles.link}>
              Create account
            </a>
          </div>
        </div>
      </div>
    </Shell>
  );
}
