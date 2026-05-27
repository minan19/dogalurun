"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";

interface Particle {
  id: number;
  x: number;
  y: number;
}

export function CartFlyAnimation() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const { lastAdded } = useCartStore();

  useEffect(() => {
    if (!lastAdded) return;

    // Sepet butonunun konumunu bul
    const cartBtn = document.querySelector('[aria-label="Sepet"], button[aria-label*="epet"]') as HTMLElement;
    if (!cartBtn) return;

    const cartRect = cartBtn.getBoundingClientRect();
    const targetX = cartRect.left + cartRect.width / 2;
    const targetY = cartRect.top + cartRect.height / 2;

    // Ekranın ortasından başlat
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;

    const id = Date.now();
    const p: Particle = { id, x: startX, y: startY };
    setParticles((prev) => [...prev, p]);

    // CSS animasyonu için hedef koordinatları CSS variable olarak set et
    const el = document.getElementById(`fly-${id}`);
    if (el) {
      el.style.setProperty("--tx", `${targetX - startX}px`);
      el.style.setProperty("--ty", `${targetY - startY}px`);
    }

    setTimeout(() => setParticles((prev) => prev.filter((p) => p.id !== id)), 700);
  }, [lastAdded]);

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          id={`fly-${p.id}`}
          style={{ left: p.x, top: p.y }}
          className="fixed z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2 animate-cart-fly"
        >
          <div className="w-5 h-5 bg-green-700 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
            </svg>
          </div>
        </div>
      ))}
    </>
  );
}
