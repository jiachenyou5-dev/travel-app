"use server";

import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/validators";
import { requireAuth } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

function generateFilename(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase() || ".jpg";
  return `${crypto.randomUUID()}${ext}`;
}

async function savePhotos(
  files: File[],
  subdir: string
): Promise<{ url: string; thumbnailUrl: string }[]> {
  const results: { url: string; thumbnailUrl: string }[] = [];
  const uploadsDir = path.join(process.cwd(), "public", "uploads", subdir);
  await mkdir(uploadsDir, { recursive: true });

  for (const file of files) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) continue;
    if (file.size > 10 * 1024 * 1024) continue;

    const filename = generateFilename(file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadsDir, filename), buffer);

    const url = `/uploads/${subdir}/${filename}`;
    results.push({ url, thumbnailUrl: url });
  }
  return results;
}

export async function createReview(
  entityType: "attraction" | "restaurant" | "accommodation",
  entityId: string,
  formData: FormData
) {
  const user = await requireAuth();

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

  revalidatePath(`/destinations`);
}

export async function deleteReview(reviewId: string) {
  const user = await requireAuth();

  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new Error("评论不存在");

  const isAdmin = (user as { role?: string }).role === "ADMIN";
  const isOwner = review.userId === (user as { id: string }).id;

  if (!isAdmin && !isOwner) throw new Error("无权删除此评论");

  await prisma.review.delete({ where: { id: reviewId } });

  revalidatePath(`/destinations`);
}
