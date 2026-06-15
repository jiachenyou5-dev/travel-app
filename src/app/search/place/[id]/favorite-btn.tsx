"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { togglePoiFavorite, checkPoiFavorited } from "@/app/actions/poi-favorites";

interface PoiFavoriteButtonProps {
  poi: {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    type: string;
  };
}

export function PoiFavoriteButton({ poi }: PoiFavoriteButtonProps) {
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkPoiFavorited(poi.id).then(setFavorited);
  }, [poi.id]);

  async function handleToggle() {
    setLoading(true);
    try {
      const result = await togglePoiFavorite(poi);
      setFavorited(result.favorited);
      toast.success(result.favorited ? "已收藏" : "已取消收藏");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "操作失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors disabled:opacity-50"
      style={
        favorited
          ? { borderColor: "var(--color-destructive)", color: "var(--color-destructive)" }
          : { borderColor: "var(--color-border)", color: "var(--color-muted-foreground)" }
      }
    >
      <Heart className={`w-4 h-4 ${favorited ? "fill-current" : ""}`} />
      {favorited ? "已收藏" : "收藏"}
    </button>
  );
}
