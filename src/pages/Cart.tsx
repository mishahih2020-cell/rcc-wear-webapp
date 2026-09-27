import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShoppingBag, X } from "lucide-react";
import { getProductById } from "../data/products";
import { useCartStore } from "../store/cartStore";
import { ProductImage } from "../components/ui/ProductImage";
import { Price } from "../components/ui/Price";
import { Button } from "../components/ui/Button";
import { QuantityStepper } from "../components/ui/QuantityStepper";
import { EmptyState } from "../components/ui/EmptyState";
import { formatPrice } from "../utils/format";
import { ALL_COLORS } from "../data/colors";
import styles from "./Cart.module.css";

const PROMO_CODES: Record<string, number> = {
  RCC10: 0.1,
  CLUB: 0.15,
};

export function Cart() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clear = useCartStore((state) => state.clear);

  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState<string | null>(null);
  const [promoError, setPromoError] = useState(false);

  const lines = useMemo(
    () =>
      items
        .map((item) => ({ item, product: getProductById(item.productId) }))
        .filter((line): line is { item: (typeof items)[number]; product: NonNullable<ReturnType<typeof getProductById>> } =>
          Boolean(line.product),
        ),
    [items],
  );

  const subtotal = lines.reduce((sum, { item, product }) => sum + product.price * item.quantity, 0);
  const discount = promoApplied ? subtotal * PROMO_CODES[promoApplied] : 0;
  const total = subtotal - discount;

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setPromoApplied(code);
      setPromoError(false);
    } else {
      setPromoApplied(null);
      setPromoError(true);
    }
  };

  if (!lines.length) {
    return (
      <div>
        <div className={styles.header}>
          <h1 className={styles.title}>Корзина</h1>
        </div>
        <EmptyState
          icon={<ShoppingBag size={24} />}
          title="Корзина пуста"
          description="Добавьте товары из каталога, чтобы оформить заказ."
          action={
            <Button variant="dark" onClick={() => navigate("/catalog")}>
              ПЕРЕЙТИ В КАТАЛОГ
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Корзина</h1>
        <button type="button" className={styles.clear} onClick={clear}>
          Очистить
        </button>
      </div>

      <div className={styles.list}>
        {lines.map(({ item, product }) => (
          <div key={`${item.productId}-${item.sizeId}-${item.colorId}`} className={styles.row}>
            <div className={styles.rowImage} onClick={() => navigate(`/product/${product.id}`)}>
              <ProductImage src={product.images[0]} alt={product.title} className={styles.rowImageInner} />
            </div>
            <div className={styles.rowInfo}>
              <p className={styles.rowTitle}>{product.title}</p>
              <p className={styles.rowMeta}>
                Размер: {item.sizeId.toUpperCase()} · Цвет: {ALL_COLORS.find((c) => c.id === item.colorId)?.name ?? "-"}
              </p>
              <div className={styles.rowBottom}>
                <QuantityStepper
                  value={item.quantity}
                  onIncrease={() => increaseQuantity(item.productId, item.sizeId, item.colorId)}
                  onDecrease={() => decreaseQuantity(item.productId, item.sizeId, item.colorId)}
                />
                <Price value={product.price * item.quantity} />
              </div>
            </div>
            <button
              type="button"
              className={styles.remove}
              onClick={() => removeItem(item.productId, item.sizeId, item.colorId)}
              aria-label="Удалить"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className={styles.promoBlock}>
        <p className={styles.promoLabel}>Промокод</p>
        <div className={styles.promoRow}>
          <input
            className={styles.promoInput}
            placeholder="Введите промокод"
            value={promoInput}
            onChange={(event) => {
              setPromoInput(event.target.value);
              setPromoError(false);
            }}
          />
          <button type="button" className={styles.promoSubmit} onClick={applyPromo} aria-label="Применить промокод">
            <ArrowRight size={16} />
          </button>
        </div>
        {promoApplied && <p className={styles.promoSuccess}>Промокод «{promoApplied}» применён</p>}
        {promoError && <p className={styles.promoErrorText}>Промокод не найден</p>}
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryRow}>
          <span>Стоимость товаров</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {promoApplied && (
          <div className={styles.summaryRow}>
            <span>Скидка по промокоду</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
        <div className={styles.summaryRow}>
          <span>Доставка</span>
          <span>Бесплатно</span>
        </div>
        <div className={styles.summaryTotal}>
          <span>Итого</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <div className={styles.footer}>
        <Button variant="primary" onClick={() => navigate("/checkout")}>
          ОФОРМИТЬ ЗАКАЗ
        </Button>
      </div>
    </div>
  );
}
