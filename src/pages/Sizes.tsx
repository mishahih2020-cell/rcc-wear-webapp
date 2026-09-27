import { BackHeader } from "../components/layout/BackHeader";
import { GARMENT_LABELS, useSizesStore, type GarmentType } from "../store/sizesStore";
import styles from "./Sizes.module.css";

const GARMENTS: GarmentType[] = ["tshirts", "shorts", "trousers", "hoodies", "outerwear"];
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

export function Sizes() {
  const savedSizes = useSizesStore((state) => state.savedSizes);
  const setSize = useSizesStore((state) => state.setSize);

  return (
    <div>
      <BackHeader title="Мои размеры" />
      <div className={styles.list}>
        {GARMENTS.map((garment) => (
          <div key={garment} className={styles.card}>
            <p className={styles.cardTitle}>{GARMENT_LABELS[garment]}</p>
            <div className={styles.sizeRow}>
              {SIZE_OPTIONS.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`${styles.sizeChip} ${savedSizes[garment] === size ? styles.sizeChipActive : ""}`}
                  onClick={() => setSize(garment, size)}
                >
                  {size}
                </button>
              ))}
            </div>
            {savedSizes[garment] && <p className={styles.savedHint}>Сохранено в вашем профиле</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
