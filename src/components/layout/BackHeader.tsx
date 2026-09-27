import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./BackHeader.module.css";

interface BackHeaderProps {
  title: string;
  action?: ReactNode;
  onBack?: () => void;
  dark?: boolean;
}

export function BackHeader({ title, action, onBack, dark }: BackHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={`${styles.header} ${dark ? styles.dark : ""}`}>
      <button type="button" className={styles.back} onClick={() => (onBack ? onBack() : navigate(-1))} aria-label="Назад">
        <ChevronLeft size={22} strokeWidth={1.75} />
      </button>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.action}>{action}</div>
    </header>
  );
}
