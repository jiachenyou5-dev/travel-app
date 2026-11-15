"use server";

import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/validators";
import { requireAuth } from "@/lib/auth-utils";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { savePhotos, removeMedia } from "@/lib/media";

export async function createReview(
  entityType: "attraction" | "restaurant" | "accommodation",
  entityId: string,
  formData: FormData
) {
  const user = await requireAuth();

  z.enum(["attraction", "restaurant", "accommodation"]).parse(entityType);
  z.string().min(1).max(100).parse(entityId);
  const target = entityType === "attraction"
    ? await prisma.attraction.findFirst({ where: { id: entityId, isPublished: true, status: "APPROVED", destination: { isPublished: true, status: "APPROVED" } } })
    : entityType === "restaurant"
      ? await prisma.restaurant.findFirst({ where: { id: entityId, isPublished: true, status: "APPROVED", destination: { isPublished: true, status: "APPROVED" } } })
      : await prisma.accommodation.findFirst({ where: { id: entityId, isPublished: true, status: "APPROVED", destination: { isPublished: true, status: "APPROVED" } } });
  if (!target) throw new Error("内容不存在或尚未发布");

  const rawData = {
    rating: Number(formData.get("rating")),
    title: (formData.get("title") as string) || undefined,
    content: formData.get("content") as string,
    visitDate: (formData.get("visitDate") as string) || undefined,
  };

  const validated = reviewSchema.parse(rawData);

  const photoFiles: File[] = [];
  const photoEntries = formData.getAll("photos");
  for (const entry of photoEntries) {
    if (entry instanceof File) photoFiles.push(entry);
  }

  const uploadedPhotos = photoFiles.length > 0
    ? await savePhotos(photoFiles, "reviews")
    : [];

  const entityField =
    entityType === "attraction"
      ? "attractionId"
      : entityType === "restaurant"
        ? "restaurantId"
        : "accommodationId";

  try {
  await prisma.review.create({
    data: {
      userId: (user as { id: string }).id,
      [entityField]: entityId,
      rating: validated.rating,
      title: validated.title || null,
      content: validated.content,
      visitDate: validated.visitDate ? new Date(validated.visitDate) : null,
      photos: {
        create: uploadedPhotos.map((p, i) => ({
          url: p.url,
          thumbnailUrl: p.thumbnailUrl,
          sortOrder: i,
        })),
      },
    },
  });

  } catch (error) {
    await removeMedia(uploadedPhotos);
    throw error;
  }
  revalidatePath("/destinations", "layout");
}

export async function deleteReview(reviewId: string) {
  const user = await requireAuth();

  const review = await prisma.review.findUnique({ where: { id: reviewId }, include: { photos: true } });
  if (!review) throw new Error("评论不存在");

  const isAdmin = (user as { role?: string }).role === "ADMIN";
  const isOwner = review.userId === (user as { id: string }).id;

  if (!isAdmin && !isOwner) throw new Error("无权删除此评论");

  await prisma.review.delete({ where: { id: reviewId } });

  await removeMedia(review.photos);
  revalidatePath("/destinations", "layout");
}

export async function updateReview(reviewId: string, formData: FormData) {
  const user = await requireAuth();
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review || review.userId !== user.id) throw new Error("无权编辑此评论");
  const data = reviewSchema.parse({
    rating: Number(formData.get("rating")),
    title: formData.get("title") || undefined,
    content: formData.get("content"),
    visitDate: formData.get("visitDate") || undefined,
  });
  await prisma.review.update({
    where: { id: reviewId },
    data: { ...data, title: data.title || null, visitDate: data.visitDate ? new Date(data.visitDate) : null },
  });
  revalidatePath("/destinations", "layout");
}
