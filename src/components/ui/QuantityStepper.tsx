import { Minus, Plus } from "lucide-react";
import styles from "./QuantityStepper.module.css";

interface QuantityStepperProps {
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
}

export function QuantityStepper({ value, onIncrease, onDecrease, min = 1, max = 10 }: QuantityStepperProps) {
  return (
    <div className={styles.stepper}>
      <button
        type="button"
        className={styles.control}
        onClick={onDecrease}
        disabled={value <= min}
        aria-label="Уменьшить количество"
      >
        <Minus size={14} strokeWidth={2.5} />
      </button>
      <span className={styles.value}>{value}</span>
      <button
        type="button"
        className={styles.control}
        onClick={onIncrease}
        disabled={value >= max}
        aria-label="Увеличить количество"
      >
        <Plus size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}
