"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  badgeLabel?: string;
  badgeCls?: string;
  discount: number;
}

export function ProductDetailImage({ src, alt, badgeLabel, badgeCls, discount }: Props) {
  const [imgError, setImgError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const hasImage = src && !imgError;

  useEffect(() => {
    if (!lightboxOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  return (
    <>
      <div
        className={`relative aspect-square rounded-2xl bg-green-50 border border-olive-border/30 overflow-hidden flex items-center justify-center ${hasImage ? "cursor-zoom-in" : ""}`}
        onClick={() => hasImage && setLightboxOpen(true)}
      >
        {hasImage ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
            unoptimized
            priority
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-9xl opacity-15">🌿</span>
        )}
        {badgeLabel && (
          <span className={`absolute top-4 left-4 text-sm font-semibold px-3 py-1.5 rounded-full ${badgeCls}`}>
            {badgeLabel}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-4 right-4 text-sm font-bold bg-red-500 text-white px-3 py-1.5 rounded-full">
            -{discount}%
          </span>
        )}
        {hasImage && (
          <div className="absolute bottom-3 right-3 p-1.5 bg-white/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <svg className="w-4 h-4 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            aria-label="Kapat"
            onClick={() => setLightboxOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
          <div
            className="relative w-full max-w-2xl aspect-square"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              unoptimized
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
