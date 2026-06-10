"use client";

import { useEffect, useRef, useState } from "react";

interface MarkerData {
  lat: number;
  lng: number;
  title: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AMapType = any;

function getAMap(): AMapType | undefined {
  return (window as unknown as Record<string, AMapType>).AMap;
}

export function AmapView({
  center,
  markers = [],
  zoom = 14,
  className,
}: {
  center?: { lat: number; lng: number };
  markers?: MarkerData[];
  zoom?: number;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<AMapType>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!getAMap()) {
        try {
          await loadAmapScript();
        } catch {
          if (!cancelled) setError(true);
          return;
        }
      }

      if (cancelled || !containerRef.current) return;

      const AMap = getAMap();
      if (!AMap) return;

      try {
        const map = new AMap.Map(containerRef.current, {
          zoom: center ? zoom : 4,
          center: center
            ? [center.lng, center.lat]
            : [116.397428, 39.90923],
        });

        mapRef.current = map;

        markers.forEach((m) => {
          const marker = new AMap.Marker({
            position: [m.lng, m.lat],
            title: m.title,
          });
          map.add(marker);
        });
      } catch {
        if (!cancelled) setError(true);
      }
    }

    init();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        try {
          mapRef.current.destroy?.();
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, [center?.lat, center?.lng, zoom, markers]);

  if (error) {
    return (
      <div className="bg-muted rounded-lg flex items-center justify-center h-64 text-muted-foreground/70 text-sm">
        地图加载失败
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={className || "w-full h-64 rounded-lg"}
    />
  );
}

let scriptPromise: Promise<void> | null = null;

function loadAmapScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    if (getAMap()) {
      resolve();
      return;
    }

    const key = process.env.NEXT_PUBLIC_AMAP_JS_KEY;
    const secret = process.env.NEXT_PUBLIC_AMAP_JS_SECRET;
    if (!key) {
      reject(new Error("Missing AMap JS API key"));
      return;
    }

    let src = `https://webapi.amap.com/maps?v=2.0&key=${key}`;
    if (secret) src += `&jscode=${secret}`;

    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Failed to load Amap script"));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}
