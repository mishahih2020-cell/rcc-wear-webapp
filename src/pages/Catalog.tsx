import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ChevronDown, SlidersHorizontal, PackageSearch } from "lucide-react";
import { Header } from "../components/layout/Header";
import { ProductCard } from "../components/ProductCard";
import { FilterSheet } from "../components/FilterSheet";
import { SkeletonGrid } from "../components/ui/SkeletonCard";
import { EmptyState } from "../components/ui/EmptyState";
import { PRODUCTS } from "../data/products";
import type { ProductCategory, ProductTag } from "../data/types";
import { useFiltersStore, type SortOption } from "../store/filtersStore";
import styles from "./Catalog.module.css";

const CATEGORY_TABS: { id: ProductCategory | "all"; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "shorts", label: "Шорты" },
  { id: "tshirts", label: "Футболки" },
  { id: "hoodies", label: "Худи" },
  { id: "outerwear", label: "Верхняя одежда" },
  { id: "rashguards", label: "Рашгарды" },
  { id: "tights", label: "Тайтсы" },
];

const SORT_LABELS: Record<SortOption, string> = {
  popular: "По популярности",
  price: "По цене",
  new: "Сначала новые",
};

export function Catalog() {
  const navigate = useNavigate();
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const tagParam = searchParams.get("tag") as ProductTag | "new" | null;

  const activeCategory = useFiltersStore((state) => state.activeCategory);
  const setCategory = useFiltersStore((state) => state.setCategory);
  const sort = useFiltersStore((state) => state.sort);
  const setSort = useFiltersStore((state) => state.setSort);
  const filters = useFiltersStore((state) => state.filters);
  const activeCount = useFiltersStore((state) => state.activeCount());

  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (category) setCategory(category);
  }, [category, setCategory]);

  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), 420);
    return () => window.clearTimeout(timer);
  }, [activeCategory, tagParam, filters, sort]);

  const filtered = useMemo(() => {
    let list = PRODUCTS.slice();

    if (activeCategory !== "all") {
      list = list.filter((product) => product.category === activeCategory);
    }

    if (tagParam === "new") {
      list = list.filter((product) => product.isNew);
    } else if (tagParam) {
      list = list.filter((product) => product.tags.includes(tagParam as ProductTag));
    }

    if (filters.sizes.length) {
      list = list.filter((product) =>
        product.sizes.some((size) => size.inStock && filters.sizes.includes(size.label)),
      );
    }
    if (filters.colors.length) {
      list = list.filter((product) => product.colors.some((color) => filters.colors.includes(color.id)));
    }
    if (filters.collections.length) {
      list = list.filter((product) => filters.collections.includes(product.collection));
    }
    if (filters.seasons.length) {
      list = list.filter((product) => filters.seasons.includes(product.season));
    }
    if (filters.materials.length) {
      list = list.filter((product) =>
        filters.materials.some((material) => product.material.toLowerCase().includes(material.toLowerCase())),
      );
    }
    list = list.filter((product) => product.price >= filters.priceMin && product.price <= filters.priceMax);

    if (sort === "price") {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === "new") {
      list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    } else {
      list.sort((a, b) => b.rating * b.reviewsCount - a.rating * a.reviewsCount);
    }

    return list;
  }, [activeCategory, tagParam, filters, sort]);

  return (
    <div>
      <Header />
      <div className={styles.titleRow}>
        <h1 className={styles.title}>МУЖСКОЕ</h1>
      </div>

      <div className={styles.tabsScroll}>
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${styles.tab} ${activeCategory === tab.id ? styles.tabActive : ""}`}
            onClick={() => {
              setCategory(tab.id);
              navigate(tab.id === "all" ? "/catalog" : `/catalog/${tab.id}`, { replace: true });
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.toolbar}>
        <button type="button" className={styles.filterButton} onClick={() => setFilterOpen(true)}>
          <SlidersHorizontal size={15} strokeWidth={1.8} />
          Фильтры
          {activeCount > 0 && <span className={styles.filterCount}>{activeCount}</span>}
        </button>
        <div className={styles.sortWrap}>
          <button type="button" className={styles.sortButton} onClick={() => setSortOpen((open) => !open)}>
            {SORT_LABELS[sort]}
            <ChevronDown size={14} strokeWidth={2} />
          </button>
          {sortOpen && (
            <div className={styles.sortMenu}>
              {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`${styles.sortOption} ${sort === option ? styles.sortOptionActive : ""}`}
                  onClick={() => {
                    setSort(option);
                    setSortOpen(false);
                  }}
                >
                  {SORT_LABELS[option]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.gridWrap}>
        {loading ? (
          <SkeletonGrid count={6} />
        ) : filtered.length ? (
          <div className={styles.grid}>
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState icon={<PackageSearch size={24} />} title="Ничего не нашли" description="Попробуйте изменить фильтры или выбрать другую категорию." />
        )}
      </div>

      <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} resultsCount={filtered.length} />
    </div>
  );
}
