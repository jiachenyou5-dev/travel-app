"use client";

import { useState, useEffect, useCallback } from "react";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";

interface Photo {
  id: string;
  url: string;
  thumbnailUrl?: string | null;
}

interface DestinationPhotoCarouselProps {
  photos: Photo[];
  /** 自动轮播间隔（毫秒），默认 4000ms */
  interval?: number;
}

export function DestinationPhotoCarousel({
  photos,
  interval = 4000,
}: DestinationPhotoCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const total = photos.length;

  const next = useCallback(() => {
    setCurrent((i) => (i + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((i) => (i - 1 + total) % total);
  }, [total]);

  // 自动轮播
  useEffect(() => {
    if (total <= 1 || paused) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [next, interval, total, paused]);

  if (total === 0) {
    return (
      <div className="h-40 bg-gradient-to-br from-primary/15 to-primary/5 rounded-t-lg flex items-center justify-center">
        <MapPin className="w-10 h-10 text-primary/40" />
      </div>
    );
  }

  return (
    <div
      className="relative h-40 rounded-t-lg overflow-hidden group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* 图片层 */}
      {photos.map((photo, i) => (
        <img
          key={photo.id}
          src={photo.url}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* 渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

      {/* 多张照片时显示左右箭头和圆点 */}
      {total > 1 && (
        <>
          {/* 左箭头 */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              prev();
            }}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {/* 右箭头 */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              next();
            }}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* 圆点指示器 */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {photos.map((photo, i) => (
              <span
                key={photo.id}
                className={`block w-1.5 h-1.5 rounded-full transition-colors ${
                  i === current ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
