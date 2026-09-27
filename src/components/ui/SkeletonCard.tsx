import styles from "./SkeletonCard.module.css";

export function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={`${styles.shimmer} ${styles.image}`} />
      <div className={`${styles.shimmer} ${styles.line}`} style={{ width: "85%" }} />
      <div className={`${styles.shimmer} ${styles.line}`} style={{ width: "45%" }} />
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}
