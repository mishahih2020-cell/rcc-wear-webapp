import { Search, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/brand/rcc-wear-logo.png";
import { useCartStore } from "../../store/cartStore";
import styles from "./Header.module.css";

export function Header() {
  const navigate = useNavigate();
  const cartCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));

  return (
    <header className={styles.header}>
      <div className={styles.spacer} />
      <button type="button" className={styles.logoButton} onClick={() => navigate("/")} aria-label="RCC WEAR — на главную">
        <img src={logo} alt="RCC WEAR" className={styles.logo} />
      </button>
      <div className={styles.actions}>
        <button type="button" className={styles.iconButton} onClick={() => navigate("/search")} aria-label="Поиск">
          <Search size={20} strokeWidth={1.75} />
        </button>
        <button type="button" className={styles.iconButton} onClick={() => navigate("/cart")} aria-label="Корзина">
          <ShoppingBag size={20} strokeWidth={1.75} />
          {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
        </button>
      </div>
    </header>
  );
}
