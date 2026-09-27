import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { BackHeader } from "../components/layout/BackHeader";
import { useOrdersStore, type OrderStatus } from "../store/ordersStore";
import { getProductById } from "../data/products";
import { formatPrice } from "../utils/format";
import styles from "./Orders.module.css";

const STATUS_TONE: Record<OrderStatus, string> = {
  Оформлен: styles.statusNew,
  Доставляется: styles.statusProgress,
  Получен: styles.statusDone,
};

export function Orders() {
  const orders = useOrdersStore((state) => state.orders);
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div>
      <BackHeader title="Мои заказы" />
      <div className={styles.list}>
        {orders.map((order) => {
          const isOpen = openId === order.id;
          return (
            <div key={order.id} className={styles.card}>
              <button type="button" className={styles.cardHeader} onClick={() => setOpenId(isOpen ? null : order.id)}>
                <div>
                  <p className={styles.orderNumber}>Заказ #{order.number}</p>
                  <p className={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString("ru-RU")}</p>
                </div>
                <div className={styles.cardRight}>
                  <span className={`${styles.status} ${STATUS_TONE[order.status]}`}>{order.status}</span>
                  <span className={styles.total}>{formatPrice(order.total)}</span>
                  <ChevronDown size={16} className={isOpen ? styles.chevronOpen : styles.chevron} />
                </div>
              </button>

              {isOpen && (
                <div className={styles.details}>
                  {order.items.length ? (
                    <div className={styles.itemsList}>
                      {order.items.map((item) => {
                        const product = getProductById(item.productId);
                        if (!product) return null;
                        return (
                          <div key={`${item.productId}-${item.sizeId}-${item.colorId}`} className={styles.itemRow}>
                            <span>
                              {product.title} × {item.quantity}
                            </span>
                            <span>{formatPrice(product.price * item.quantity)}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className={styles.detailsMuted}>Состав демо-заказа недоступен.</p>
                  )}
                  <div className={styles.detailsRow}>
                    <span>Способ доставки</span>
                    <span>{order.deliveryMethod}</span>
                  </div>
                  <div className={styles.detailsRow}>
                    <span>Адрес</span>
                    <span>{order.address}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
