import logo from "../../assets/brand/rcc-wear-logo.png";
import styles from "./ProductImage.module.css";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
}

function isPlaceholder(src: string) {
  return !src.includes(".") && !src.startsWith("http") && !src.startsWith("data:");
}

export function ProductImage({ src, alt, className }: ProductImageProps) {
  if (isPlaceholder(src)) {
    return (
      <div className={`${styles.placeholder} ${className ?? ""}`} role="img" aria-label={alt}>
        <img src={logo} alt="" aria-hidden="true" className={styles.mark} />
      </div>
    );
  }

  return <img src={src} alt={alt} className={`${styles.image} ${className ?? ""}`} loading="lazy" />;
}
