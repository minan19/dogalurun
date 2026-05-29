"use client";

import { useState } from "react";
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
  const hasImage = src && !imgError;

  return (
    <div className="relative aspect-square rounded-2xl bg-green-50 border border-olive-border/30 overflow-hidden flex items-center justify-center">
      {hasImage ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
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
    </div>
  );
}
