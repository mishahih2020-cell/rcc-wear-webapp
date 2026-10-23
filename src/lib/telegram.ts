// Работаем напрямую с официальным скриптом telegram.org/js/telegram-web-app.js (подключён в index.html).
// @twa-dev/sdk не используем: он при импорте подменяет window.Telegram.WebApp своей устаревшей копией,
// в которой нет fullscreen и contentSafeAreaInset.

export interface Insets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe?: { user?: { id: number; first_name: string; last_name?: string; username?: string } };
  version: string;
  platform: string;
  isFullscreen?: boolean;
  safeAreaInset?: Insets;
  contentSafeAreaInset?: Insets;
  ready: () => void;
  expand: () => void;
  requestFullscreen?: () => void;
  disableVerticalSwipes?: () => void;
  setBackgroundColor?: (color: string) => void;
  setHeaderColor?: (color: string) => void;
  onEvent?: (event: string, cb: () => void) => void;
  offEvent?: (event: string, cb: () => void) => void;
}

export function getTelegram(): TelegramWebApp | undefined {
  return (window as unknown as { Telegram?: { WebApp?: TelegramWebApp } }).Telegram?.WebApp;
}

export function safeCall(fn: () => void) {
  try {
    fn();
  } catch {
    // метод не поддерживается этой версией клиента — просто пропускаем
  }
}
