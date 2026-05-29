"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cartStore";

export function CartAbandonGuard() {
  const count = useCartStore((s) => s.count);

  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (count() > 0) {
        e.preventDefault();
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [count]);

  return null;
}
