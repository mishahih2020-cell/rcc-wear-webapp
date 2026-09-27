import { formatPrice } from "../../utils/format";
import styles from "./Price.module.css";

interface PriceProps {
  value: number;
  oldValue?: number;
  size?: "default" | "large";
}

export function Price({ value, oldValue, size = "default" }: PriceProps) {
  return (
    <span className={`${styles.wrap} ${size === "large" ? styles.large : ""}`}>
      <span className={styles.current}>{formatPrice(value)}</span>
      {oldValue ? <span className={styles.old}>{formatPrice(oldValue)}</span> : null}
    </span>
  );
}
