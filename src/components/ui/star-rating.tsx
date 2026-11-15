"use client";

import { Star } from "@/components/ui/clay-icons";
import { useState } from "react";

function StarIcon({
  filled,
  half,
  interactive,
  onHover,
  onLeave,
  onClick,
}: {
  filled: boolean;
  half?: boolean;
  interactive?: boolean;
  onHover?: () => void;
  onLeave?: () => void;
  onClick?: () => void;
}) {
  return (
    <span
      className={interactive ? "cursor-pointer" : ""}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      <Star
        className={`w-5 h-5 ${
          filled
            ? "text-star fill-star"
            : half
              ? "text-star fill-star/50"
              : "text-muted-foreground/40"
        }`}
      />
    </span>
  );
}

export function StarRatingDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" title={`${rating} 星`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon key={star} filled={star <= rating} />
      ))}
    </div>
  );
}

export function StarRatingInput({
  value,
  onChange,
  size,
}: {
  value: number;
  onChange: (rating: number) => void;
  size?: "sm" | "default";
}) {
  const [hovered, setHovered] = useState(0);

  const w = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || value);
        return (
          <button
            type="button"
            aria-label={`${star} 星`}
            aria-pressed={value === star}
            key={star}
            className="flex size-9 items-center justify-center rounded-md focus-visible:outline-2 focus-visible:outline-ring"
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(star)}
          >
            <Star
              className={`${w} ${
                filled
                  ? "text-star fill-star"
                  : "text-muted-foreground/40"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
