import { useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Share2, ShoppingBag, Star, Check } from "lucide-react";
import { getProductById } from "../data/products";
import { ProductImage } from "../components/ui/ProductImage";
import { HeartButton } from "../components/ui/HeartButton";
import { Price } from "../components/ui/Price";
import { Button } from "../components/ui/Button";
import { ProductGallery } from "../components/ProductGallery";
import { SizeChartSheet } from "../components/SizeChartSheet";
import { AddedToCartToast } from "../components/AddedToCartToast";
import { EmptyState } from "../components/ui/EmptyState";
import { useCartStore } from "../store/cartStore";
import { useFavoritesStore } from "../store/favoritesStore";
import { useSizesStore, type GarmentType } from "../store/sizesStore";
import type { ProductCategory } from "../data/types";
import styles from "./ProductPage.module.css";

const CATEGORY_TO_GARMENT: Partial<Record<ProductCategory, GarmentType>> = {
  shorts: "shorts",
  tshirts: "tshirts",
  hoodies: "hoodies",
  outerwear: "outerwear",
};

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = useMemo(() => (id ? getProductById(id) : undefined), [id]);

  const addItem = useCartStore((state) => state.addItem);
  const cartCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const isFavorite = useFavoritesStore((state) => (product ? state.isFavorite(product.id) : false));
  const toggleFavorite = useFavoritesStore((state) => state.toggleProduct);
  const savedSizes = useSizesStore((state) => state.savedSizes);

  const [activeImage, setActiveImage] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const savedSizeForCategory = product ? savedSizes[CATEGORY_TO_GARMENT[product.category] ?? ("" as GarmentType)] : undefined;
  const preferredSize = product?.sizes.find((s) => s.inStock && s.label === savedSizeForCategory)?.label;
  const [selectedSize, setSelectedSize] = useState(
    preferredSize ?? product?.recommendedSize ?? product?.sizes.find((s) => s.inStock)?.label ?? "",
  );
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.id ?? "");
  const [added, setAdded] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [flight, setFlight] = useState<{ left: number; top: number; size: number; dx: number; dy: number } | null>(null);
  const [cartBump, setCartBump] = useState(false);

  const mainImageRef = useRef<HTMLDivElement>(null);
  const cartIconRef = useRef<HTMLButtonElement>(null);

  if (!product) {
    return (
      <div className={styles.notFound}>
        <EmptyState
          icon={<ChevronLeft size={24} />}
          title="Товар не найден"
          description="Возможно, он был удалён из каталога."
          action={
            <Button variant="dark" onClick={() => navigate("/catalog")}>
              В каталог
            </Button>
          }
        />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addItem({ productId: product.id, sizeId: selectedSize.toLowerCase(), colorId: selectedColor });
    setAdded(true);

    const imageEl = mainImageRef.current;
    const cartEl = cartIconRef.current;
    if (imageEl && cartEl) {
      const imageRect = imageEl.getBoundingClientRect();
      const cartRect = cartEl.getBoundingClientRect();
      const size = 84;
      const left = imageRect.left + imageRect.width / 2 - size / 2;
      const top = imageRect.top + imageRect.height / 2 - size / 2;
      const dx = cartRect.left + cartRect.width / 2 - (left + size / 2);
      const dy = cartRect.top + cartRect.height / 2 - (top + size / 2);
      setFlight({ left, top, size, dx, dy });
    }

    const FLIGHT_DURATION = 950;
    window.setTimeout(() => {
      setFlight(null);
      setCartBump(true);
      window.setTimeout(() => setCartBump(false), 400);
    }, FLIGHT_DURATION);

    setToastOpen(true);
    window.setTimeout(() => setToastOpen(false), 2600);
    window.setTimeout(() => setAdded(false), 1800);
  };

  const handleShare = async () => {
    const shareData = { title: product.title, text: product.title, url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
      }
    } catch {
      // пользователь отменил системный диалог шэринга — это ожидаемо
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button type="button" className={styles.iconButton} onClick={() => navigate(-1)} aria-label="Назад">
          <ChevronLeft size={22} strokeWidth={1.75} />
        </button>
        <div className={styles.topBarActions}>
          <HeartButton active={isFavorite} onToggle={() => toggleFavorite(product.id)} size={19} className={styles.iconButton} />
          <button type="button" className={styles.iconButton} onClick={handleShare} aria-label="Поделиться">
            <Share2 size={19} strokeWidth={1.75} />
          </button>
          <motion.button
            ref={cartIconRef}
            type="button"
            className={styles.iconButton}
            onClick={() => navigate("/cart")}
            aria-label="Корзина"
            animate={cartBump ? { scale: [1, 1.22, 1] } : { scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <ShoppingBag size={18} strokeWidth={1.75} />
            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </motion.button>
        </div>
      </div>

      <motion.div
        ref={mainImageRef}
        layoutId={`product-image-${product.id}`}
        className={styles.mainImage}
        onClick={() => setGalleryOpen(true)}
      >
        <ProductImage src={product.images[activeImage]} alt={product.title} className={styles.mainImageInner} />
      </motion.div>

      <div className={styles.thumbRow}>
        {product.images.map((image, index) => (
          <button
            key={image + index}
            type="button"
            className={`${styles.thumb} ${index === activeImage ? styles.thumbActive : ""}`}
            onClick={() => setActiveImage(index)}
          >
            <ProductImage src={image} alt={`${product.title} ${index + 1}`} className={styles.thumbImage} />
          </button>
        ))}
      </div>

      <div className={styles.info}>
        <h1 className={styles.title}>{product.title}</h1>
        <Price value={product.price} oldValue={product.oldPrice} size="large" />

        <div className={styles.metaRow}>
          <span className={styles.stock}>
            <span className={`${styles.dot} ${product.inStock ? styles.dotIn : styles.dotOut}`} />
            {product.inStock ? "В наличии" : "Нет в наличии"}
          </span>
          <span className={styles.rating}>
            <Star size={13} fill="#111111" color="#111111" />
            {product.rating.toFixed(1)} · {product.reviewsCount} отзывов
          </span>
        </div>

        <div className={styles.sectionHeader}>
          <p className={styles.sectionTitle}>Размер</p>
          <button type="button" className={styles.sizeChartLink} onClick={() => setSizeChartOpen(true)}>
            Таблица размеров
          </button>
        </div>
        <div className={styles.sizeRow}>
          {product.sizes.map((size) => (
            <button
              key={size.id}
              type="button"
              disabled={!size.inStock}
              className={`${styles.sizeChip} ${selectedSize === size.label ? styles.sizeChipActive : ""}`}
              onClick={() => setSelectedSize(size.label)}
            >
              {size.label}
            </button>
          ))}
        </div>
        {product.recommendedSize && <p className={styles.recommendedHint}>Рекомендуемый размер: {product.recommendedSize}</p>}

        <p className={styles.sectionTitle}>Цвет: {product.colors.find((c) => c.id === selectedColor)?.name}</p>
        <div className={styles.colorRow}>
          {product.colors.map((color) => (
            <button
              key={color.id}
              type="button"
              className={`${styles.colorDot} ${selectedColor === color.id ? styles.colorDotActive : ""}`}
              style={{ background: color.hex }}
              onClick={() => setSelectedColor(color.id)}
              aria-label={color.name}
            />
          ))}
        </div>

        <p className={styles.description}>{product.description}</p>
      </div>

      <div className={styles.footer}>
        <div className={styles.addWrap}>
          <Button variant="primary" disabled={!product.inStock || !selectedSize} onClick={handleAddToCart}>
            {added ? (
              <>
                <Check size={16} /> ДОБАВЛЕНО
              </>
            ) : (
              "ДОБАВИТЬ В КОРЗИНУ"
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {flight && (
          <motion.div
            className={styles.flyThumb}
            style={{ left: flight.left, top: flight.top, width: flight.size, height: flight.size }}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }}
            animate={{
              x: [0, flight.dx * 0.42, flight.dx],
              y: [0, flight.dy * 0.6 - 60, flight.dy],
              scale: [1, 0.75, 0.18],
              rotate: [0, -6, 8],
              opacity: [1, 1, 0.4],
            }}
            transition={{ duration: 0.95, ease: [0.3, 0.1, 0.3, 1], times: [0, 0.55, 1] }}
          >
            <ProductImage src={product.images[activeImage]} alt="" className={styles.flyThumbImage} />
          </motion.div>
        )}
      </AnimatePresence>

      <AddedToCartToast open={toastOpen} title={product.title} image={product.images[activeImage]} />

      <ProductGallery
        open={galleryOpen}
        images={product.images}
        alt={product.title}
        initialIndex={activeImage}
        onClose={() => setGalleryOpen(false)}
      />
      <SizeChartSheet open={sizeChartOpen} onClose={() => setSizeChartOpen(false)} />
    </div>
  );
}
