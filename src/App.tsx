import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AppRoutes } from "./app/routes";
import { SplashScreen } from "./components/SplashScreen";
import { useTelegram } from "./hooks/useTelegram";

const SPLASH_SEEN_KEY = "rcc-splash-seen";

type SplashPhase = "active" | "leaving" | "gone";

function useSplashPhase() {
  const [phase, setPhase] = useState<SplashPhase>("active");
  const [short] = useState(() => {
    try {
      return sessionStorage.getItem(SPLASH_SEEN_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const activeTimer = window.setTimeout(
      () => {
        setPhase("leaving");
        try {
          sessionStorage.setItem(SPLASH_SEEN_KEY, "1");
        } catch {
          // localStorage может быть недоступен в приватном режиме Telegram WebView
        }
      },
      short ? 700 : 2600,
    );
    return () => window.clearTimeout(activeTimer);
  }, [short]);

  useEffect(() => {
    if (phase !== "leaving") return;
    const safetyTimer = window.setTimeout(() => setPhase("gone"), 500);
    return () => window.clearTimeout(safetyTimer);
  }, [phase]);

  return { phase, short, finishLeaving: () => setPhase("gone") };
}

export default function App() {
  const { phase, short, finishLeaving } = useSplashPhase();
  useTelegram();

  return (
    <>
      {phase !== "gone" && <SplashScreen short={short} leaving={phase === "leaving"} onLeaveEnd={finishLeaving} />}
      {phase === "gone" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "flex", flexDirection: "column", flex: 1 }}
        >
          <AppRoutes />
        </motion.div>
      )}
    </>
  );
}
