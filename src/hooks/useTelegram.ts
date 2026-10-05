import { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";
import { useUserStore } from "../store/userStore";

interface TelegramState {
  isTelegram: boolean;
  isFullscreen: boolean;
  themeParams: Record<string, string>;
}

// Гарантированный минимум под круглые кнопки закрытия/меню Telegram в fullscreen —
// на части клиентов contentSafeAreaInset приходит нулевым или заниженным, и контент
// реально оказывается под кнопками, хотя API формально отчитался об отступе.
const MIN_FULLSCREEN_TOP_CLEARANCE = 64;

function applySafeAreaVars() {
  const root = document.documentElement.style;
  const safe = WebApp.safeAreaInset ?? { top: 0, bottom: 0, left: 0, right: 0 };
  const content = WebApp.contentSafeAreaInset ?? { top: 0, bottom: 0, left: 0, right: 0 };

  // contentSafeAreaInset — область, перекрытая кнопками Telegram (закрыть, меню) в fullscreen.
  // safeAreaInset — системная safe area устройства (чёлка, home indicator).
  // Складываем оба, чтобы интерфейс не оказался ни под системными вырезами, ни под кнопками Telegram.
  const contentTop = WebApp.isFullscreen ? Math.max(content.top, MIN_FULLSCREEN_TOP_CLEARANCE) : content.top;

  root.setProperty("--safe-top", `${safe.top + contentTop}px`);
  root.setProperty("--safe-bottom", `${safe.bottom + content.bottom}px`);
  root.setProperty("--safe-left", `${safe.left + content.left}px`);
  root.setProperty("--safe-right", `${safe.right + content.right}px`);
}

export function useTelegram(): TelegramState {
  const setTelegramProfile = useUserStore((state) => state.setTelegramProfile);
  const [state, setState] = useState<TelegramState>({
    isTelegram: false,
    isFullscreen: false,
    themeParams: {},
  });

  useEffect(() => {
    try {
      const isTelegram = Boolean(WebApp.initData);
      WebApp.ready();
      WebApp.expand();

      // Без этого свайп вниз по контенту сворачивает/закрывает мини-приложение.
      WebApp.disableVerticalSwipes();

      try {
        WebApp.requestFullscreen();
      } catch {
        // fullscreen не поддерживается на этой платформе (например, Telegram Desktop) — остаёмся в expanded режиме
      }

      WebApp.setBackgroundColor("#ffffff");
      WebApp.setHeaderColor("#ffffff");

      const user = WebApp.initDataUnsafe?.user;
      if (user) {
        setTelegramProfile({
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          username: user.username,
        });
      }

      applySafeAreaVars();
      setState({
        isTelegram,
        isFullscreen: WebApp.isFullscreen,
        themeParams: WebApp.themeParams as unknown as Record<string, string>,
      });

      const handleSafeAreaChange = () => applySafeAreaVars();
      const handleFullscreenChanged = () => {
        applySafeAreaVars();
        setState((prev) => ({ ...prev, isFullscreen: WebApp.isFullscreen }));
      };

      WebApp.onEvent("safeAreaChanged", handleSafeAreaChange);
      WebApp.onEvent("contentSafeAreaChanged", handleSafeAreaChange);
      WebApp.onEvent("viewportChanged", handleSafeAreaChange);
      WebApp.onEvent("fullscreenChanged", handleFullscreenChanged);
      WebApp.onEvent("fullscreenFailed", handleFullscreenChanged);

      return () => {
        WebApp.offEvent("safeAreaChanged", handleSafeAreaChange);
        WebApp.offEvent("contentSafeAreaChanged", handleSafeAreaChange);
        WebApp.offEvent("viewportChanged", handleSafeAreaChange);
        WebApp.offEvent("fullscreenChanged", handleFullscreenChanged);
        WebApp.offEvent("fullscreenFailed", handleFullscreenChanged);
      };
    } catch {
      setState((prev) => ({ ...prev, isTelegram: false }));
    }
  }, [setTelegramProfile]);

  return state;
}
