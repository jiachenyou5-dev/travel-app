"use client";

import { ReviewList } from "@/components/reviews/review-list";
import { ReviewForm } from "@/components/reviews/review-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createReview, deleteReview, updateReview } from "@/app/actions/reviews";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

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

export function EntityReviewsSection({
  entityType,
  entityId,
  reviews,
  currentUserId,
  isAdmin,
}: {
  entityType: "attraction" | "restaurant" | "accommodation";
  entityId: string;
  reviews: Review[];
  currentUserId?: string;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingReview = reviews.find(review => review.id === editingId);

  async function handleCreateReview(formData: FormData) {
    await createReview(entityType, entityId, formData);
    router.refresh();
  }

  async function handleDeleteReview(reviewId: string) {
    try {
      await deleteReview(reviewId);
      toast.success("评论已删除");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "删除失败");
    }
  }

  return (
    <div className="space-y-8">
      <Dialog open={!!editingReview} onOpenChange={open => { if (!open) setEditingId(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>编辑评论</DialogTitle></DialogHeader>
          {editingReview && <ReviewForm
            key={editingReview.id}
            defaultValues={{ rating: editingReview.rating, title: editingReview.title ?? "", content: editingReview.content, visitDate: editingReview.visitDate?.slice(0, 10) ?? "" }}
            submitLabel="保存修改"
            allowPhotos={false}
            action={async formData => {
              await updateReview(editingReview.id, formData);
              setEditingId(null);
              router.refresh();
            }}
          />}
        </DialogContent>
      </Dialog>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">评论 ({reviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ReviewList
            reviews={reviews}
            currentUserId={currentUserId}
            isAdmin={isAdmin}
            onDelete={handleDeleteReview}
            onEdit={setEditingId}
          />
        </CardContent>
      </Card>

      {currentUserId ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">发表评论</CardTitle>
          </CardHeader>
          <CardContent>
            <ReviewForm action={handleCreateReview} />
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-6 bg-muted rounded-lg">
          <p className="text-muted-foreground text-sm">请先登录后发表评论</p>
        </div>
      )}
    </div>
  );
}
