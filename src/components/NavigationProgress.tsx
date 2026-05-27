"use client";

import { usePathname } from "@/i18n/navigation";
import { useEffect, useRef, useState } from "react";

export function NavigationProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completeRef = useRef(false);

  // Link tıklanınca progress başlat
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      // Dış link, anchor veya aynı sayfa ise atla
      if (!href || href.startsWith("http") || href.startsWith("#") || href === window.location.pathname) return;

      completeRef.current = false;
      setProgress(0);
      setVisible(true);

      // Hızlı başla, sonra yavaşla (gerçekçi his)
      let p = 0;
      timerRef.current = setInterval(() => {
        p += p < 30 ? 8 : p < 60 ? 4 : p < 80 ? 2 : p < 90 ? 0.5 : 0;
        setProgress(Math.min(p, 91));
        if (p >= 91) clearInterval(timerRef.current!);
      }, 80);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Sayfa değişince tamamla
  useEffect(() => {
    if (!visible) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setProgress(100);
    const t = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 400);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!visible && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none"
      aria-hidden
    >
      <div
        className="h-full bg-gradient-to-r from-green-600 via-gold-400 to-green-600"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
          transitionProperty: "width, opacity",
          transitionDuration: progress === 100 ? "0.2s, 0.3s" : "0.08s, 0s",
          transitionTimingFunction: "ease-out, ease",
        }}
      />
    </div>
  );
}
