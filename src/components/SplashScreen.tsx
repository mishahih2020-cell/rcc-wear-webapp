import logo from "../assets/brand/rcc-wear-logo.png";
import styles from "./SplashScreen.module.css";

interface SplashScreenProps {
  short?: boolean;
  leaving?: boolean;
  onLeaveEnd?: () => void;
}

export function SplashScreen({ short = false, leaving = false, onLeaveEnd }: SplashScreenProps) {
  return (
    <div
      className={`${styles.wrap} ${leaving ? styles.leaving : ""}`}
      onTransitionEnd={(event) => {
        if (event.propertyName === "opacity" && leaving) onLeaveEnd?.();
      }}
    >
      <div className={styles.center}>
        <div className={`${styles.glow} ${short ? styles.fastCycle : ""}`} />
        <img
          src={logo}
          alt="RCC WEAR"
          className={`${styles.logo} ${short ? styles.fastCycle : ""} ${leaving ? styles.logoLeaving : ""}`}
        />
      </div>
      <div className={styles.loading}>
        <span className={styles.loadingText}>ЗАГРУЗКА...</span>
        <div className={styles.progressTrack}>
          <div className={`${styles.progressBar} ${short ? styles.progressShort : ""}`} />
        </div>
      </div>
    </div>
  );
}
