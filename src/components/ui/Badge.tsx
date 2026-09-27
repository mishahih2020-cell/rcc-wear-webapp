import type { ReactNode } from "react";
import styles from "./Badge.module.css";

interface BadgeProps {
  children: ReactNode;
  tone?: "red" | "dark" | "outline";
  className?: string;
}

export function Badge({ children, tone = "red", className }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[tone]} ${className ?? ""}`}>{children}</span>;
}
