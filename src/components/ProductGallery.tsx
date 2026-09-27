import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { ProductImage } from "./ui/ProductImage";
import styles from "./ProductGallery.module.css";

interface ProductGalleryProps {
  open: boolean;
  images: string[];
  alt: string;
  initialIndex: number;
  onClose: () => void;
}

export function ProductGallery({ open, images, alt, initialIndex, onClose }: ProductGalleryProps) {
  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);

  const goTo = (nextIndex: number, dir: number) => {
    if (nextIndex < 0 || nextIndex >= images.length) return;
    setDirection(dir);
    setIndex(nextIndex);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className={styles.topBar}>
            <span className={styles.counter}>
              {index + 1} / {images.length}
            </span>
            <button type="button" className={styles.close} onClick={onClose} aria-label="Закрыть">
              <X size={22} color="#fff" />
            </button>
          </div>

          <div className={styles.stage}>
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={index}
                className={styles.slide}
                custom={direction}
                initial={{ x: direction >= 0 ? 60 : -60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction >= 0 ? -60 : 60, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) goTo(index + 1, 1);
                  else if (info.offset.x > 60) goTo(index - 1, -1);
                }}
              >
                <ProductImage src={images[index]} alt={alt} className={styles.image} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className={styles.thumbs}>
            {images.map((image, i) => (
              <button
                key={image + i}
                type="button"
                className={`${styles.thumb} ${i === index ? styles.thumbActive : ""}`}
                onClick={() => goTo(i, i > index ? 1 : -1)}
              >
                <ProductImage src={image} alt={`${alt} ${i + 1}`} className={styles.thumbImage} />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
