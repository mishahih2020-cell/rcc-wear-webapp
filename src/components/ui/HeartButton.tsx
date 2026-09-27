import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import styles from "./HeartButton.module.css";

interface HeartButtonProps {
  active: boolean;
  onToggle: () => void;
  size?: number;
  className?: string;
}

export function HeartButton({ active, onToggle, size = 18, className }: HeartButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.button} ${className ?? ""}`}
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      aria-pressed={active}
      aria-label={active ? "Убрать из избранного" : "Добавить в избранное"}
    >
      <AnimatePresence>
        {active && (
          <motion.span
            className={styles.ripple}
            initial={{ scale: 0, opacity: 0.35 }}
            animate={{ scale: 2.1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
      <motion.span
        key={active ? "on" : "off"}
        initial={{ scale: 0.8 }}
        animate={{ scale: [0.8, 1.15, 1] }}
        transition={{ duration: 0.32, ease: "easeOut" }}
        className={styles.iconWrap}
      >
        <Heart size={size} fill={active ? "var(--color-red)" : "none"} color={active ? "var(--color-red)" : "var(--color-text-primary)"} strokeWidth={1.75} />
      </motion.span>
    </button>
  );
}
