"use client";

import { ReviewCard } from "./review-card";
import { MessageSquareText } from "@/components/ui/clay-icons";

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
  isAdmin?: boolean;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  pageSize?: number;
}

export function ReviewList({
  reviews,
  currentUserId,
  isAdmin,
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
          isAdmin={isAdmin}
          reviewUserId={review.userId}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
