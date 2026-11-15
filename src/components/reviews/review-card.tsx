"use client";

import { StarRatingDisplay } from "@/components/ui/star-rating";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "@/components/ui/clay-icons";
import { ImageGrid } from "@/components/ui/image-upload";
import { useState } from "react";
import { Lightbox } from "@/components/ui/lightbox";

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    title?: string | null;
    content: string;
    visitDate?: string | null;
    createdAt: string;
    user: { name?: string | null; image?: string | null };
    photos: { id: string; url: string; thumbnailUrl?: string | null }[];
  };
  currentUserId?: string;
  isAdmin?: boolean;
  reviewUserId: string;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function ReviewCard({
  review,
  currentUserId,
  isAdmin = false,
  reviewUserId,
  onDelete,
  onEdit,
}: ReviewCardProps) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const isOwner = currentUserId === reviewUserId;

  const dateStr = review.visitDate
    ? new Date(review.visitDate).toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-foreground">
              {review.user.name || "匿名用户"}
            </span>
            {dateStr && (
              <span className="text-xs text-muted-foreground/70">{dateStr} 到访</span>
            )}
          </div>
          <StarRatingDisplay rating={review.rating} />
        </div>

        {(isOwner || isAdmin) && (
          <div className="flex items-center gap-1">
            {isOwner && onEdit && (
              <Button
                variant="ghost"
                size="sm"
                aria-label="编辑评论"
                onClick={() => onEdit(review.id)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                aria-label="删除评论"
                onClick={() => onDelete(review.id)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            )}
          </div>
        )}
      </div>

      {review.title && (
        <h4 className="font-medium text-foreground/90 mb-1">{review.title}</h4>
      )}
      <p className="text-muted-foreground text-sm whitespace-pre-wrap">
        {review.content}
      </p>

      {review.photos.length > 0 && (
        <div className="mt-3">
          <ImageGrid
            images={review.photos.map((p) => ({
              id: p.id,
              url: p.thumbnailUrl || p.url,
            }))}
            onView={setLightboxIndex}
          />
          <Lightbox
            images={review.photos.map((p) => ({ url: p.url }))}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(-1)}
            onPrev={() =>
              setLightboxIndex(
                (lightboxIndex - 1 + review.photos.length) %
                  review.photos.length
              )
            }
            onNext={() =>
              setLightboxIndex((lightboxIndex + 1) % review.photos.length)
            }
          />
        </div>
      )}
    </div>
  );
}
