import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./ui/Button";
import { ALL_COLORS } from "../data/colors";
import {
  PRICE_MAX,
  PRICE_MIN,
  useFiltersStore,
} from "../store/filtersStore";
import styles from "./FilterSheet.module.css";

interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
  resultsCount: number;
}

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];
const COLLECTION_OPTIONS = ["Sport Collection", "Essentials", "Архангел Михаил x RW", "Fight Collection", "RCC CLUB", "Heritage"];
const SEASON_OPTIONS = ["Всесезон", "Осень-Зима", "Весна-Лето"];
const MATERIAL_OPTIONS = ["Полиэстер", "Хлопок", "Эластан"];

export function FilterSheet({ open, onClose, resultsCount }: FilterSheetProps) {
  const filters = useFiltersStore((state) => state.filters);
  const toggleValue = useFiltersStore((state) => state.toggleValue);
  const setPriceRange = useFiltersStore((state) => state.setPriceRange);
  const reset = useFiltersStore((state) => state.reset);

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
              <h2 className={styles.title}>Фильтры</h2>
              <button type="button" className={styles.reset} onClick={reset}>
                Сбросить
              </button>
              <button type="button" className={styles.close} onClick={onClose} aria-label="Закрыть">
                <X size={20} />
              </button>
            </div>

            <div className={styles.scroll}>
              <section className={styles.section}>
                <p className={styles.sectionTitle}>Размер</p>
                <div className={styles.chipRow}>
                  {SIZE_OPTIONS.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`${styles.chip} ${filters.sizes.includes(size) ? styles.chipActive : ""}`}
                      onClick={() => toggleValue("sizes", size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </section>

              <section className={styles.section}>
                <p className={styles.sectionTitle}>Цвет</p>
                <div className={styles.colorRow}>
                  {ALL_COLORS.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      className={`${styles.colorDot} ${filters.colors.includes(color.id) ? styles.colorDotActive : ""}`}
                      style={{ background: color.hex }}
                      onClick={() => toggleValue("colors", color.id)}
                      aria-label={color.name}
                      aria-pressed={filters.colors.includes(color.id)}
                    />
                  ))}
                </div>
              </section>

              <FilterAccordionSection
                title="Коллекция"
                options={COLLECTION_OPTIONS}
                selected={filters.collections}
                onToggle={(value) => toggleValue("collections", value)}
              />
              <FilterAccordionSection
                title="Сезон"
                options={SEASON_OPTIONS}
                selected={filters.seasons}
                onToggle={(value) => toggleValue("seasons", value)}
              />
              <FilterAccordionSection
                title="Материал"
                options={MATERIAL_OPTIONS}
                selected={filters.materials}
                onToggle={(value) => toggleValue("materials", value)}
              />

              <section className={styles.section}>
                <p className={styles.sectionTitle}>Цена</p>
                <div className={styles.priceRow}>
                  <input
                    type="range"
                    min={PRICE_MIN}
                    max={filters.priceMax}
                    value={filters.priceMin}
                    onChange={(event) => setPriceRange(Number(event.target.value), filters.priceMax)}
                  />
                  <input
                    type="range"
                    min={filters.priceMin}
                    max={PRICE_MAX}
                    value={filters.priceMax}
                    onChange={(event) => setPriceRange(filters.priceMin, Number(event.target.value))}
                  />
                </div>
                <div className={styles.priceLabels}>
                  <span>{filters.priceMin.toLocaleString("ru-RU")} ₽</span>
                  <span>{filters.priceMax.toLocaleString("ru-RU")} ₽</span>
                </div>
              </section>
            </div>

            <div className={styles.footer}>
              <Button variant="dark" onClick={onClose}>
                ПРИМЕНИТЬ ({resultsCount})
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function FilterAccordionSection({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <section className={styles.section}>
      <p className={styles.sectionTitle}>{title}</p>
      <div className={styles.chipRow}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`${styles.chip} ${selected.includes(option) ? styles.chipActive : ""}`}
            onClick={() => onToggle(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  );
}
