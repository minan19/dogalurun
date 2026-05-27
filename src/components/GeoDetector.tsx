"use client";

import { useEffect } from "react";
import { useGeoStore } from "@/store/geoStore";

// Sessiz IP tabanlı konum tespiti — browser izni gerektirmez, KVKK uyumlu
// Yalnızca ülke/şehir bilgisi alınır; kesin konum, IP veya kişisel veri saklanmaz
export function GeoDetector() {
  const { detected, setGeo } = useGeoStore();

  useEffect(() => {
    if (detected) return; // Daha önce tespit yapılmışsa atla

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    fetch("https://ipapi.co/json/", {
      signal: controller.signal,
      cache: "no-store",
    })
      .then((r) => {
        if (!r.ok) throw new Error("ipapi error");
        return r.json();
      })
      .then((data: { country_code?: string; country_name?: string; city?: string }) => {
        if (data?.country_code) {
          setGeo(
            data.country_code,
            data.country_name ?? data.country_code,
            data.city ?? ""
          );
        }
      })
      .catch(() => {
        // Sessizce atla — varsayılan TR kalır
      })
      .finally(() => clearTimeout(timeout));

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [detected, setGeo]);

  return null;
}
