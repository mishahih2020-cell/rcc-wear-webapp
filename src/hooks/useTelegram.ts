import { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";
import { useUserStore } from "../store/userStore";

interface TelegramState {
  isTelegram: boolean;
  themeParams: Record<string, string>;
  safeAreaInset: { top: number; bottom: number; left: number; right: number };
}

export function useTelegram(): TelegramState {
  const setTelegramProfile = useUserStore((state) => state.setTelegramProfile);
  const [state, setState] = useState<TelegramState>({
    isTelegram: false,
    themeParams: {},
    safeAreaInset: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  useEffect(() => {
    try {
      const isTelegram = Boolean(WebApp.initData);
      WebApp.ready();
      WebApp.expand();

      const user = WebApp.initDataUnsafe?.user;
      if (user) {
        setTelegramProfile({
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          username: user.username,
        });
      }

      setState({
        isTelegram,
        themeParams: WebApp.themeParams as unknown as Record<string, string>,
        safeAreaInset: {
          top: WebApp.safeAreaInset?.top ?? 0,
          bottom: WebApp.safeAreaInset?.bottom ?? 0,
          left: WebApp.safeAreaInset?.left ?? 0,
          right: WebApp.safeAreaInset?.right ?? 0,
        },
      });
    } catch {
      setState((prev) => ({ ...prev, isTelegram: false }));
    }
  }, [setTelegramProfile]);

  return state;
}
