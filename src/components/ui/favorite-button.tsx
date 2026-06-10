"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleFavorite } from "@/app/actions/favorites";
import { useRouter } from "next/navigation";

export function FavoriteButton({
  entityType,
  entityId,
  initialFavorited,
}: {
  entityType: "destination" | "attraction" | "restaurant" | "accommodation";
  entityId: string;
  initialFavorited: boolean;
}) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [beating, setBeating] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick() {
    startTransition(async () => {
      try {
        const result = await toggleFavorite(entityType, entityId);
        setFavorited(result.favorited);
        if (result.favorited) {
          setBeating(true);
          setTimeout(() => setBeating(false), 400);
        }
        router.refresh();
      } catch {
        router.push("/login");
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className={`p-2 rounded-full transition-all duration-200 ${
        favorited
          ? "text-destructive bg-destructive/10 hover:bg-destructive/15"
          : "text-muted-foreground/70 bg-muted hover:bg-muted hover:text-destructive/60"
      }`}
      title={favorited ? "取消收藏" : "收藏"}
    >
      <Heart
        className={`w-5 h-5 transition-transform ${favorited ? "fill-current" : ""} ${beating ? "animate-[heart-beat_0.4s_ease]" : ""}`}
      />
    </button>
  );
}
