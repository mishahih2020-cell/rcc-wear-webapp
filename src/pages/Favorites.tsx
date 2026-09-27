import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { PRODUCTS } from "../data/products";
import { useFavoritesStore } from "../store/favoritesStore";
import { ProductImage } from "../components/ui/ProductImage";
import { HeartButton } from "../components/ui/HeartButton";
import { Price } from "../components/ui/Price";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import styles from "./Favorites.module.css";

export function Favorites() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"products" | "brands">("products");
  const favoriteIds = useFavoritesStore((state) => state.productIds);
  const toggleFavorite = useFavoritesStore((state) => state.toggleProduct);
  const favoriteProducts = PRODUCTS.filter((product) => favoriteIds.includes(product.id));

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Избранное</h1>
        <div className={styles.modeRow}>
          <button
            type="button"
            className={`${styles.modeButton} ${mode === "products" ? styles.modeActive : ""}`}
            onClick={() => setMode("products")}
          >
            Товары ({favoriteProducts.length})
          </button>
          <button
            type="button"
            className={`${styles.modeButton} ${mode === "brands" ? styles.modeActive : ""}`}
            onClick={() => setMode("brands")}
          >
            Бренды (1)
          </button>
        </div>
      </div>

      {mode === "products" ? (
        favoriteProducts.length ? (
          <div className={styles.list}>
            {favoriteProducts.map((product) => (
              <div key={product.id} className={styles.row} onClick={() => navigate(`/product/${product.id}`)}>
                <div className={styles.rowImage}>
                  <ProductImage src={product.images[0]} alt={product.title} className={styles.rowImageInner} />
                </div>
                <div className={styles.rowInfo}>
                  <p className={styles.rowTitle}>{product.title}</p>
                  <Price value={product.price} oldValue={product.oldPrice} />
                </div>
                <HeartButton active onToggle={() => toggleFavorite(product.id)} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Heart size={24} />}
            title="Избранное пока пусто"
            description="Сохраняйте понравившиеся вещи, чтобы вернуться к ним позже."
            action={
              <Button variant="dark" onClick={() => navigate("/catalog")}>
                ПЕРЕЙТИ В КАТАЛОГ
              </Button>
            }
          />
        )
      ) : (
        <div className={styles.list}>
          <div className={styles.brandRow}>
            <span className={styles.brandName}>RCC WEAR</span>
            <span className={styles.brandHint}>Официальный бренд</span>
          </div>
        </div>
      )}
    </div>
  );
}
