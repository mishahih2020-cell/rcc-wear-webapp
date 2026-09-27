import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, MapPin, Truck } from "lucide-react";
import { BackHeader } from "../components/layout/BackHeader";
import { Button } from "../components/ui/Button";
import { useCartStore } from "../store/cartStore";
import { useOrdersStore } from "../store/ordersStore";
import { getProductById } from "../data/products";
import { STORE_LOCATIONS } from "../data/stores";
import { formatPrice } from "../utils/format";
import styles from "./Checkout.module.css";

const STEPS = ["Контакты", "Доставка", "Оплата"];

export function Checkout() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clear);
  const createOrder = useOrdersStore((state) => state.createOrder);

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"cdek" | "pickup">("cdek");
  const [storeId, setStoreId] = useState(STORE_LOCATIONS[0].id);

  const total = useMemo(
    () =>
      items.reduce((sum, item) => {
        const product = getProductById(item.productId);
        return sum + (product ? product.price * item.quantity : 0);
      }, 0),
    [items],
  );

  const canContinueContacts = name.trim().length > 1 && phone.trim().length >= 5;
  const canContinueDelivery = deliveryMethod === "cdek" || Boolean(storeId);

  const handleNext = () => {
    if (step === 0 && !canContinueContacts) return;
    if (step === 1 && !canContinueDelivery) return;
    if (step < 2) {
      setStep(step + 1);
      return;
    }

    const address =
      deliveryMethod === "cdek"
        ? "СДЭК"
        : STORE_LOCATIONS.find((store) => store.id === storeId)?.address ?? "Самовывоз";

    const order = createOrder({
      items,
      total,
      address,
      deliveryMethod: deliveryMethod === "cdek" ? "СДЭК" : "Самовывоз",
    });
    clearCart();
    navigate(`/order-success/${order.id}`, { replace: true });
  };

  return (
    <div className={styles.page}>
      <BackHeader title="Оформление заказа" />

      <div className={styles.steps}>
        {STEPS.map((label, index) => (
          <div key={label} className={styles.stepItem}>
            <span className={`${styles.stepDot} ${index <= step ? styles.stepDotActive : ""}`}>
              {index < step ? <Check size={12} /> : index + 1}
            </span>
            <span className={index === step ? styles.stepLabelActive : styles.stepLabel}>{label}</span>
            {index < STEPS.length - 1 && <span className={styles.stepLine} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className={styles.content}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          {step === 0 && (
            <div className={styles.form}>
              <label className={styles.field}>
                <span>Имя</span>
                <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Иван Иванов" />
              </label>
              <label className={styles.field}>
                <span>Телефон</span>
                <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+7 900 000 00 00" type="tel" />
              </label>
            </div>
          )}

          {step === 1 && (
            <div className={styles.form}>
              <div className={styles.deliveryOptions}>
                <button
                  type="button"
                  className={`${styles.deliveryOption} ${deliveryMethod === "cdek" ? styles.deliveryOptionActive : ""}`}
                  onClick={() => setDeliveryMethod("cdek")}
                >
                  <Truck size={18} />
                  СДЭК
                </button>
                <button
                  type="button"
                  className={`${styles.deliveryOption} ${deliveryMethod === "pickup" ? styles.deliveryOptionActive : ""}`}
                  onClick={() => setDeliveryMethod("pickup")}
                >
                  <MapPin size={18} />
                  Самовывоз
                </button>
              </div>

              {deliveryMethod === "pickup" && (
                <div className={styles.storeList}>
                  {STORE_LOCATIONS.map((store) => (
                    <button
                      key={store.id}
                      type="button"
                      className={`${styles.storeCard} ${storeId === store.id ? styles.storeCardActive : ""}`}
                      onClick={() => setStoreId(store.id)}
                    >
                      <span className={styles.storeName}>{store.name}</span>
                      <span className={styles.storeAddress}>{store.address}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className={styles.form}>
              <div className={styles.summaryCard}>
                <div className={styles.summaryRow}>
                  <span>Получатель</span>
                  <span>{name || "—"}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Телефон</span>
                  <span>{phone || "—"}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Доставка</span>
                  <span>{deliveryMethod === "cdek" ? "СДЭК" : "Самовывоз"}</span>
                </div>
                <div className={styles.summaryTotal}>
                  <span>Итого к оплате</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <p className={styles.paymentHint}>Оплата картой при оформлении через Telegram.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className={styles.footer}>
        <Button
          variant="primary"
          onClick={handleNext}
          disabled={(step === 0 && !canContinueContacts) || (step === 1 && !canContinueDelivery)}
        >
          {step === 0 ? "ПРОДОЛЖИТЬ" : step === 1 ? "ПЕРЕЙТИ К ОПЛАТЕ" : "ОПЛАТИТЬ"}
        </Button>
      </div>
    </div>
  );
}
