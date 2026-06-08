import React from "react";
import styles from "./ui.module.css";

export default function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={[styles.card, className].join(" ")}>{children}</section>;
}