import { Heart, Home, ShoppingBag, Store, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCartStore } from "../../store/cartStore";
import styles from "./BottomNavigation.module.css";

const TABS = [
  { path: "/", label: "Главная", icon: Home },
  { path: "/catalog", label: "Каталог", icon: Store },
  { path: "/cart", label: "Корзина", icon: ShoppingBag },
  { path: "/favorites", label: "Избранное", icon: Heart },
  { path: "/profile", label: "Профиль", icon: User },
];

function isActive(pathname: string, path: string) {
  if (path === "/") return pathname === "/";
  return pathname.startsWith(path);
}

export function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const cartCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));

  return (
    <nav className={styles.nav}>
      {TABS.map(({ path, label, icon: Icon }) => {
        const active = isActive(location.pathname, path);
        return (
          <button
            key={path}
            type="button"
            className={styles.tab}
            onClick={() => navigate(path)}
            aria-current={active ? "page" : undefined}
          >
            {active && (
              <motion.span layoutId="nav-indicator" className={styles.indicator} transition={{ duration: 0.3, ease: "easeOut" }} />
            )}
            <span className={styles.iconWrap}>
              <motion.span
                animate={active ? { scale: [0.85, 1.08, 1] } : { scale: 1 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className={styles.iconInner}
              >
                <Icon
                  size={22}
                  strokeWidth={active ? 2 : 1.6}
                  color={active ? "var(--color-red)" : "var(--color-text-secondary)"}
                />
              </motion.span>
              {path === "/cart" && cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
            </span>
            <span className={active ? styles.labelActive : styles.label}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
