import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { BackHeader } from "../components/layout/BackHeader";
import styles from "./Support.module.css";

const FAQ = [
  {
    question: "Как отследить заказ?",
    answer: "Статус заказа доступен в разделе «Мои заказы» в профиле RCC CLUB — он обновляется автоматически.",
  },
  {
    question: "Как вернуть или обменять товар?",
    answer: "Свяжитесь с магазином, где было совершено самовывозное оформление, либо укажите номер заказа при обращении в поддержку.",
  },
  {
    question: "Сколько действуют бонусы RCC CLUB?",
    answer: "Бонусы не сгорают и списываются автоматически при оформлении заказа, если вы решите их потратить.",
  },
  {
    question: "Можно ли изменить адрес после оформления заказа?",
    answer: "Да, если заказ ещё не передан в доставку — обратитесь в поддержку с номером заказа.",
  },
];

export function Support() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div>
      <BackHeader title="Поддержка" />
      <p className={styles.intro}>Ответы на частые вопросы. Если не нашли нужного — напишите нам в чате бренда в Telegram.</p>
      <div className={styles.list}>
        {FAQ.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={item.question} className={styles.item}>
              <button type="button" className={styles.question} onClick={() => setOpenIndex(isOpen ? null : index)}>
                {item.question}
                <ChevronDown size={16} className={isOpen ? styles.chevronOpen : styles.chevron} />
              </button>
              {isOpen && <p className={styles.answer}>{item.answer}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
