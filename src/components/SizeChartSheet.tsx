import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import styles from "./SizeChartSheet.module.css";

interface SizeChartSheetProps {
  open: boolean;
  onClose: () => void;
}

const ROWS = [
  { size: "XS", chest: "88-92", waist: "70-74" },
  { size: "S", chest: "92-96", waist: "74-78" },
  { size: "M", chest: "96-100", waist: "78-82" },
  { size: "L", chest: "100-106", waist: "82-88" },
  { size: "XL", chest: "106-112", waist: "88-94" },
  { size: "XXL", chest: "112-118", waist: "94-100" },
];

export function SizeChartSheet({ open, onClose }: SizeChartSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.div
            className={styles.sheet}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.handle} />
            <div className={styles.header}>
              <h2 className={styles.title}>Таблица размеров</h2>
              <button type="button" className={styles.close} onClick={onClose} aria-label="Закрыть">
                <X size={20} />
              </button>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Размер</th>
                  <th>Грудь, см</th>
                  <th>Талия, см</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.size}>
                    <td>{row.size}</td>
                    <td>{row.chest}</td>
                    <td>{row.waist}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
