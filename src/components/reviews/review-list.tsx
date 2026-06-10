"use client";

import { ReviewCard } from "./review-card";
import { Button } from "@/components/ui/button";
import { MessageSquareText } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  title?: string | null;
  content: string;
  visitDate?: string | null;
  createdAt: string;
  userId: string;
  user: { name?: string | null; image?: string | null };
  photos: { id: string; url: string; thumbnailUrl?: string | null }[];
}

interface ReviewListProps {
  reviews: Review[];
  currentUserId?: string;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  pageSize?: number;
}

export function ReviewList({
  reviews,
  currentUserId,
  onDelete,
  onEdit,
}: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground/70">
        <MessageSquareText className="w-10 h-10 mx-auto mb-2" />
        <p className="text-sm">暂无评论，来写第一条吧</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={{
            ...review,
            createdAt: review.createdAt.toString(),
          }}
          currentUserId={currentUserId}
          reviewUserId={review.userId}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
