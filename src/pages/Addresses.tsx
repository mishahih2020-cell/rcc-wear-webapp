import { useState } from "react";
import { MapPin, Plus, X } from "lucide-react";
import { BackHeader } from "../components/layout/BackHeader";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { useAddressStore } from "../store/addressStore";
import styles from "./Addresses.module.css";

export function Addresses() {
  const addresses = useAddressStore((state) => state.addresses);
  const addAddress = useAddressStore((state) => state.addAddress);
  const removeAddress = useAddressStore((state) => state.removeAddress);

  const [formOpen, setFormOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");

  const canSave = label.trim() && city.trim() && street.trim();

  const handleSave = () => {
    if (!canSave) return;
    addAddress({ label: label.trim(), city: city.trim(), street: street.trim() });
    setLabel("");
    setCity("");
    setStreet("");
    setFormOpen(false);
  };

  return (
    <div>
      <BackHeader title="Адреса доставки" />

      {addresses.length > 0 && (
        <div className={styles.list}>
          {addresses.map((address) => (
            <div key={address.id} className={styles.row}>
              <MapPin size={18} strokeWidth={1.6} className={styles.rowIcon} />
              <div className={styles.rowInfo}>
                <p className={styles.rowLabel}>{address.label}</p>
                <p className={styles.rowAddress}>
                  {address.city}, {address.street}
                </p>
              </div>
              <button type="button" className={styles.remove} onClick={() => removeAddress(address.id)} aria-label="Удалить адрес">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {!addresses.length && !formOpen && (
        <EmptyState
          icon={<MapPin size={24} />}
          title="Нет сохранённых адресов"
          description="Добавьте адрес, чтобы быстрее оформлять доставку СДЭК."
        />
      )}

      <div className={styles.footer}>
        {formOpen ? (
          <div className={styles.form}>
            <input className={styles.input} placeholder="Название (например, Дом)" value={label} onChange={(e) => setLabel(e.target.value)} />
            <input className={styles.input} placeholder="Город" value={city} onChange={(e) => setCity(e.target.value)} />
            <input className={styles.input} placeholder="Улица, дом, квартира" value={street} onChange={(e) => setStreet(e.target.value)} />
            <Button variant="dark" onClick={handleSave} disabled={!canSave}>
              Сохранить адрес
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={() => setFormOpen(true)}>
            <Plus size={16} /> Добавить адрес
          </Button>
        )}
      </div>
    </div>
  );
}
