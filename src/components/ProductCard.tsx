import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { Product } from "../data/types";
import { ProductImage } from "./ui/ProductImage";
import { Badge } from "./ui/Badge";
import { Price } from "./ui/Price";
import { HeartButton } from "./ui/HeartButton";
import { useFavoritesStore } from "../store/favoritesStore";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const navigate = useNavigate();
  const isFavorite = useFavoritesStore((state) => state.isFavorite(product.id));
  const toggleFavorite = useFavoritesStore((state) => state.toggleProduct);

  return (
    <motion.article
      className={`${styles.card} ${className ?? ""}`}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      onClick={() => navigate(`/product/${product.id}`)}
      role="button"
      tabIndex={0}
    >
      <div className={styles.imageWrap}>
        <motion.div layoutId={`product-image-${product.id}`} className={styles.imageInner}>
          <ProductImage src={product.images[0]} alt={product.title} className={styles.image} />
        </motion.div>
        <div className={styles.badges}>
          {product.isNew && <Badge tone="red">NEW</Badge>}
          {product.oldPrice && <Badge tone="dark">SALE</Badge>}
        </div>
        <HeartButton active={isFavorite} onToggle={() => toggleFavorite(product.id)} className={styles.heart} />
      </div>
      <div className={styles.info}>
        <p className={styles.title}>{product.title}</p>
        <Price value={product.price} oldValue={product.oldPrice} />
      </div>
    </motion.article>
  );
}
