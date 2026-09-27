import { useNavigate } from "react-router-dom";
import { ChevronRight, Crown, Heart, LifeBuoy, MapPin, Ruler, ShoppingBag, User as UserIcon } from "lucide-react";
import { useUserStore } from "../store/userStore";
import { ProductCard } from "../components/ProductCard";
import { PRODUCTS } from "../data/products";
import { Button } from "../components/ui/Button";
import styles from "./RccClub.module.css";

const MENU_ITEMS = [
  { icon: ShoppingBag, label: "Мои заказы", path: "/profile/orders" },
  { icon: Heart, label: "Избранное", path: "/favorites" },
  { icon: Ruler, label: "Мои размеры", path: "/profile/sizes" },
  { icon: MapPin, label: "Адреса доставки", path: "/profile/addresses" },
  { icon: LifeBuoy, label: "Поддержка", path: "/profile/support" },
];

export function RccClub() {
  const navigate = useNavigate();
  const telegramProfile = useUserStore((state) => state.telegramProfile);
  const bonuses = useUserStore((state) => state.bonuses);
  const statusName = useUserStore((state) => state.statusName);
  const nextStatusName = useUserStore((state) => state.nextStatusName);
  const statusThreshold = useUserStore((state) => state.statusThreshold);
  const statusProgress = useUserStore((state) => state.statusProgress);

  const displayName = telegramProfile
    ? `${telegramProfile.firstName}${telegramProfile.lastName ? ` ${telegramProfile.lastName}` : ""}`
    : "Гость RCC WEAR";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const progressPercent = Math.min(100, Math.round((statusProgress / statusThreshold) * 100));
  const recommended = PRODUCTS.slice(0, 4);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>RCC CLUB</h1>
      </div>

      <div className={styles.profileRow}>
        <div className={styles.avatar}>{telegramProfile ? initials : <UserIcon size={20} />}</div>
        <div>
          <p className={styles.name}>{displayName}</p>
          {telegramProfile?.username ? (
            <p className={styles.username}>@{telegramProfile.username}</p>
          ) : (
            <p className={styles.username}>Откройте в Telegram для входа</p>
          )}
        </div>
      </div>

      <div className={styles.bonusCard}>
        <div>
          <p className={styles.bonusLabel}>Ваши бонусы</p>
          <p className={styles.bonusValue}>{bonuses.toLocaleString("ru-RU")} ₽</p>
        </div>
        <Button variant="primary" size="small" onClick={() => navigate("/catalog")} className={styles.spendButton}>
          Потратить
        </Button>
      </div>

      <div className={styles.statusBlock}>
        <div className={styles.statusHeaderRow}>
          <span className={styles.statusHeaderLabel}>До следующего статуса</span>
          <span className={styles.statusHeaderValue}>{Math.max(0, statusThreshold - statusProgress).toLocaleString("ru-RU")} ₽</span>
        </div>
        <div className={styles.progressTrack}>
          <div className={styles.progressBar} style={{ width: `${progressPercent}%` }} />
        </div>
        <div className={styles.statusFooterRow}>
          <span className={styles.statusChip}>
            <Crown size={12} /> {statusName}
          </span>
          <span className={styles.statusFooterText}>
            {statusProgress.toLocaleString("ru-RU")} ₽ / {statusThreshold.toLocaleString("ru-RU")} ₽ до «{nextStatusName}»
          </span>
        </div>
      </div>

      <div className={styles.menu}>
        {MENU_ITEMS.map(({ icon: Icon, label, path }) => (
          <button key={path} type="button" className={styles.menuItem} onClick={() => navigate(path)}>
            <span className={styles.menuLeft}>
              <Icon size={18} strokeWidth={1.6} />
              {label}
            </span>
            <ChevronRight size={16} color="var(--color-text-secondary)" />
          </button>
        ))}
      </div>

      <div className={styles.recommendations}>
        <p className={styles.recommendationsTitle}>ПЕРСОНАЛЬНЫЕ РЕКОМЕНДАЦИИ</p>
        <div className={styles.recommendationsGrid}>
          {recommended.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
