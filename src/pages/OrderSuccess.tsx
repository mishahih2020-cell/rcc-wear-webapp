import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useOrdersStore } from "../store/ordersStore";
import { Button } from "../components/ui/Button";
import styles from "./OrderSuccess.module.css";

export function OrderSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = useOrdersStore((state) => state.orders.find((o) => o.id === id));

  useEffect(() => {
    if (!order) {
      navigate("/", { replace: true });
    }
  }, [order, navigate]);

  if (!order) return null;

  return (
    <div className={styles.page}>
      <div className={styles.checkWrap}>
        <motion.div
          className={styles.ripple}
          initial={{ scale: 0.6, opacity: 0.4 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
        <motion.div
          className={styles.check}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [0.5, 1.1, 1], opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Check size={34} strokeWidth={3} color="#fff" />
        </motion.div>
      </div>

      <motion.h1
        className={styles.title}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.35 }}
      >
        Заказ оформлен!
      </motion.h1>
      <p className={styles.subtitle}>Спасибо за покупку.</p>
      <p className={styles.orderNumber}>Номер заказа: {order.number}</p>

      <div className={styles.actions}>
        <button type="button" className={styles.trackLink} onClick={() => navigate("/profile/orders")}>
          Отследить заказ
        </button>
        <Button variant="dark" onClick={() => navigate("/profile/orders")}>
          ПЕРЕЙТИ В ЗАКАЗЫ
        </Button>
        <button type="button" className={styles.homeLink} onClick={() => navigate("/")}>
          Вернуться на главную
        </button>
      </div>
    </div>
  );
}
