"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EntityPhotosSection } from "@/components/reviews/entity-photos-section";
import { EntityReviewsSection } from "@/components/reviews/entity-reviews-section";

interface Photo {
  id: string;
  url: string;
  altText?: string | null;
}

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

export function EntityTabsSection({
  entityType,
  entityId,
  photos,
  reviews,
  currentUserId,
  isAdmin,
}: {
  entityType: "attraction" | "restaurant" | "accommodation";
  entityId: string;
  photos: Photo[];
  reviews: Review[];
  currentUserId?: string;
  isAdmin: boolean;
}) {
  return (
    <Tabs defaultValue="photos">
      <TabsList>
        <TabsTrigger value="photos">照片</TabsTrigger>
        <TabsTrigger value="reviews">评论</TabsTrigger>
      </TabsList>
      <TabsContent value="photos" className="mt-4">
        <EntityPhotosSection photos={photos} />
      </TabsContent>
      <TabsContent value="reviews" className="mt-4">
        <EntityReviewsSection
          entityType={entityType}
          entityId={entityId}
          reviews={reviews}
          currentUserId={currentUserId}
          isAdmin={isAdmin}
        />
      </TabsContent>
    </Tabs>
  );
}
