import { useEffect, useState } from "react";
import { getTelegram, safeCall } from "../lib/telegram";
import { useUserStore } from "../store/userStore";

interface TelegramState {
  isTelegram: boolean;
  isFullscreen: boolean;
}

// Если клиент в fullscreen, но не сообщил высоту зоны своих кнопок — берём минимум
// под ряд «Закрыть» / «⌄ •••», чтобы интерфейс гарантированно оказался ниже.
const MIN_FULLSCREEN_CONTROLS_HEIGHT = 52;

function applySafeAreaVars() {
  const tg = getTelegram();
  const root = document.documentElement.style;
  if (!tg || !tg.initData) return;

  const safe = tg.safeAreaInset ?? { top: 0, bottom: 0, left: 0, right: 0 };
  const content = tg.contentSafeAreaInset ?? { top: 0, bottom: 0, left: 0, right: 0 };
  const contentTop = tg.isFullscreen ? Math.max(content.top, MIN_FULLSCREEN_CONTROLS_HEIGHT) : content.top;

  root.setProperty("--safe-top", `${safe.top + contentTop}px`);
  root.setProperty("--safe-bottom", `${safe.bottom + content.bottom}px`);
  root.setProperty("--safe-left", `${safe.left + content.left}px`);
  root.setProperty("--safe-right", `${safe.right + content.right}px`);
}

export function useTelegram(): TelegramState {
  const setTelegramProfile = useUserStore((state) => state.setTelegramProfile);
  const [state, setState] = useState<TelegramState>({ isTelegram: false, isFullscreen: false });

  useEffect(() => {
    const tg = getTelegram();
    if (!tg) return;

    safeCall(() => tg.ready());
    safeCall(() => tg.expand());
    safeCall(() => tg.disableVerticalSwipes?.());
    if (!tg.isFullscreen) safeCall(() => tg.requestFullscreen?.());
    safeCall(() => tg.setBackgroundColor?.("#ffffff"));
    safeCall(() => tg.setHeaderColor?.("#ffffff"));

    const user = tg.initDataUnsafe?.user;
    if (user) {
      setTelegramProfile({ id: user.id, firstName: user.first_name, lastName: user.last_name, username: user.username });
    }

    const sync = () => {
      applySafeAreaVars();
      setState({ isTelegram: Boolean(tg.initData), isFullscreen: Boolean(tg.isFullscreen) });
    };
    sync();

    const events = ["safeAreaChanged", "contentSafeAreaChanged", "viewportChanged", "fullscreenChanged", "fullscreenFailed"];
    events.forEach((event) => safeCall(() => tg.onEvent?.(event, sync)));
    // некоторые клиенты присылают инсеты с задержкой и без события
    const timers = [300, 1000, 2500].map((ms) => window.setTimeout(sync, ms));

    return () => {
      events.forEach((event) => safeCall(() => tg.offEvent?.(event, sync)));
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [setTelegramProfile]);

  return state;
}
