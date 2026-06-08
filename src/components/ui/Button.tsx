"use client";
import React from "react";
import styles from "./ui.module.css";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={[
        styles.btn,
        styles[variant],
        styles[size],
        props.disabled ? styles.disabled : "",
        className,
      ].join(" ")}
    />
  );
}