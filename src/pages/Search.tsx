import { useMemo, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, SearchX, X } from "lucide-react";
import { PRODUCTS } from "../data/products";
import { ProductCard } from "../components/ProductCard";
import { EmptyState } from "../components/ui/EmptyState";
import { POPULAR_QUERIES, useSearchStore } from "../store/searchStore";
import styles from "./Search.module.css";

export function Search() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const recentQueries = useSearchStore((state) => state.recentQueries);
  const addQuery = useSearchStore((state) => state.addQuery);
  const clearRecent = useSearchStore((state) => state.clearRecent);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return PRODUCTS.filter((product) => product.title.toLowerCase().includes(normalized));
  }, [query]);

  const runQuery = (value: string) => {
    setQuery(value);
    if (value.trim()) addQuery(value.trim());
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (query.trim()) addQuery(query.trim());
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Назад">
          <ChevronLeft size={22} strokeWidth={1.75} />
        </button>
        <form className={styles.searchForm} onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            autoFocus
            className={styles.input}
            placeholder="Что ищем?"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <button type="button" className={styles.clearInput} onClick={() => setQuery("")} aria-label="Очистить">
              <X size={16} />
            </button>
          )}
        </form>
      </div>

      {!query && (
        <div className={styles.suggestions}>
          {recentQueries.length > 0 && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <p className={styles.sectionTitle}>Последние запросы</p>
                <button type="button" className={styles.clearLink} onClick={clearRecent}>
                  Очистить
                </button>
              </div>
              <div className={styles.chipRow}>
                {recentQueries.map((item) => (
                  <button key={item} type="button" className={styles.chip} onClick={() => runQuery(item)}>
                    {item}
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className={styles.section}>
            <p className={styles.sectionTitle}>Популярные запросы</p>
            <div className={styles.chipRow}>
              {POPULAR_QUERIES.map((item) => (
                <button key={item} type="button" className={styles.chip} onClick={() => runQuery(item)}>
                  {item}
                </button>
              ))}
            </div>
          </section>
        </div>
      )}

      {query && (
        <div className={styles.resultsWrap}>
          {results.length ? (
            <div className={styles.grid}>
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState icon={<SearchX size={24} />} title="Ничего не нашли" description="Попробуйте другой запрос." />
          )}
        </div>
      )}
    </div>
  );
}
