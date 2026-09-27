import { useNavigate } from "react-router-dom";
import { Dumbbell, Shirt, Sparkles, Swords } from "lucide-react";
import { motion } from "framer-motion";
import { Header } from "../components/layout/Header";
import { Button } from "../components/ui/Button";
import { ProductCard } from "../components/ProductCard";
import { PRODUCTS } from "../data/products";
import styles from "./Home.module.css";

const QUICK_CATEGORIES = [
  { label: "Тренировки", tag: "training", icon: Dumbbell },
  { label: "Единоборства", tag: "combat", icon: Swords },
  { label: "Everyday", tag: "everyday", icon: Shirt },
  { label: "Новинки", tag: "new", icon: Sparkles },
];

export function Home() {
  const navigate = useNavigate();
  const newArrivals = PRODUCTS.filter((product) => product.isNew);

  return (
    <div>
      <Header />

      <section className={styles.hero}>
        <div className={styles.heroImage} aria-hidden="true">
          <div className={styles.heroRing} />
          <div className={styles.heroStripe} />
          <div className={styles.heroGrain} />
        </div>
        <div className={styles.heroContent}>
          <span className={styles.heroKicker}>RCC WEAR — SS&apos;26</span>
          <h1 className={styles.heroTitle}>
            ДЛЯ ТЕХ, КТО
            <br />
            <span className={styles.heroTitleAccent}>ИДЁТ ДАЛЬШЕ</span>
          </h1>
          <p className={styles.heroSubtitle}>Спортивная одежда для тренировок и повседневной жизни.</p>
          <Button variant="primary" onClick={() => navigate("/catalog")} className={styles.heroButton}>
            Смотреть каталог
          </Button>
        </div>
      </section>

      <section className={styles.quickCategories}>
        {QUICK_CATEGORIES.map(({ label, tag, icon: Icon }) => (
          <motion.button
            key={tag}
            type="button"
            whileTap={{ scale: 0.95 }}
            className={styles.quickCard}
            onClick={() => navigate(`/catalog?tag=${tag}`)}
          >
            <span className={styles.quickIcon}>
              <Icon size={17} strokeWidth={1.5} />
            </span>
            <span>{label}</span>
          </motion.button>
        ))}
      </section>

      <section className={styles.rail}>
        <div className={styles.railHeader}>
          <h2 className={styles.railTitle}>НОВЫЕ ПОСТУПЛЕНИЯ</h2>
        </div>
        <div className={styles.railScroll}>
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} className={styles.railCard} />
          ))}
        </div>
      </section>
    </div>
  );
}
