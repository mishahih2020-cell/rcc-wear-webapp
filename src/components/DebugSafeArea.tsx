import { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";

// Временный диагностический бейдж — показывает реальные значения Telegram API
// на конкретном устройстве, чтобы подобрать точный отступ вместо угадывания.
// Убрать после диагностики.
export function DebugSafeArea() {
  const [info, setInfo] = useState("init...");

  useEffect(() => {
    const update = () => {
      const cssTop = getComputedStyle(document.documentElement).getPropertyValue("--safe-top").trim();
      const safe = WebApp.safeAreaInset;
      const content = WebApp.contentSafeAreaInset;
      const parts = [
        `css:${cssTop}`,
        `fs:${String(WebApp.isFullscreen)}`,
        `init:${Boolean(WebApp.initData)}`,
        `v:${WebApp.version}`,
        `plat:${WebApp.platform}`,
        `safe:${safe ? `${safe.top}/${safe.bottom}` : "null"}`,
        `cont:${content ? `${content.top}/${content.bottom}` : "null"}`,
      ];
      setInfo(parts.join(" "));
    };
    update();
    const t1 = window.setTimeout(update, 500);
    const t2 = window.setTimeout(update, 1500);
    WebApp.onEvent("fullscreenChanged", update);
    WebApp.onEvent("safeAreaChanged", update);
    WebApp.onEvent("contentSafeAreaChanged", update);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      WebApp.offEvent("fullscreenChanged", update);
      WebApp.offEvent("safeAreaChanged", update);
      WebApp.offEvent("contentSafeAreaChanged", update);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        left: 4,
        bottom: 4,
        zIndex: 999,
        maxWidth: "calc(100% - 8px)",
        padding: "4px 6px",
        background: "rgba(0,0,0,0.75)",
        color: "#0f0",
        fontSize: "9px",
        fontFamily: "monospace",
        lineHeight: 1.3,
        borderRadius: "4px",
        wordBreak: "break-all",
        pointerEvents: "none",
      }}
    >
      {info}
    </div>
  );
}
