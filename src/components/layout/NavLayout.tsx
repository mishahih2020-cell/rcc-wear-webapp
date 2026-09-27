import { Outlet } from "react-router-dom";
import { BottomNavigation } from "./BottomNavigation";
import styles from "./NavLayout.module.css";

export function NavLayout() {
  return (
    <>
      <div className={styles.content}>
        <Outlet />
      </div>
      <BottomNavigation />
    </>
  );
}
