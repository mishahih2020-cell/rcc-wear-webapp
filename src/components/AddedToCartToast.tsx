import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { ProductImage } from "./ui/ProductImage";
import styles from "./AddedToCartToast.module.css";

interface AddedToCartToastProps {
  open: boolean;
  title: string;
  image: string;
}

export function AddedToCartToast({ open, title, image }: AddedToCartToastProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.toast}
          initial={{ opacity: 0, y: -16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.97 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.thumb}>
            <ProductImage src={image} alt="" className={styles.thumbImage} />
          </div>
          <div className={styles.text}>
            <p className={styles.title}>Товар в корзине</p>
            <p className={styles.product}>{title}</p>
          </div>
          <span className={styles.check}>
            <Check size={13} strokeWidth={3} color="#fff" />
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
