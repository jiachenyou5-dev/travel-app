"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { savePhotos, removeMedia } from "@/lib/media";

type EntityType = "attraction" | "restaurant" | "accommodation";

export async function uploadEntityPhotos(
  entityType: EntityType,
  entityId: string,
  formData: FormData
) {
  await requireAdmin();

  const files: File[] = [];
  const entries = formData.getAll("photos");
  for (const entry of entries) {
    if (entry instanceof File) files.push(entry);
  }
  if (files.length === 0) throw new Error("未选择文件");

  const maxSort = await prisma.photo.aggregate({
    where: { [entityType === "attraction" ? "attractionId" : entityType === "restaurant" ? "restaurantId" : "accommodationId"]: entityId },
    _max: { sortOrder: true },
  });
  const nextSort = (maxSort._max.sortOrder ?? -1) + 1;

  const idField =
    entityType === "attraction"
      ? "attractionId"
      : entityType === "restaurant"
        ? "restaurantId"
        : "accommodationId";

  const uploadedPhotos = await savePhotos(files, `${entityType}s`);
  try {
    await prisma.photo.createMany({ data: uploadedPhotos.map((photo, index) => ({
      ...photo, sortOrder: nextSort + index, [idField]: entityId,
    })) });
  } catch (error) {
    await removeMedia(uploadedPhotos);
    throw error;
  }

  // 找到对应的 destinationId 用于 revalidate
  if (entityType === "attraction") {
    const attr = await prisma.attraction.findUnique({ where: { id: entityId }, select: { destinationId: true } });
    if (attr) revalidatePath(`/destinations/${attr.destinationId}/attractions/${entityId}`);
  } else if (entityType === "restaurant") {
    const rest = await prisma.restaurant.findUnique({ where: { id: entityId }, select: { destinationId: true } });
    if (rest) revalidatePath(`/destinations/${rest.destinationId}/restaurants/${entityId}`);
  } else {
    const acc = await prisma.accommodation.findUnique({ where: { id: entityId }, select: { destinationId: true } });
    if (acc) revalidatePath(`/destinations/${acc.destinationId}/accommodations/${entityId}`);
  }
}
